"""
Dark Luxury Portfolio - Flask Serverless Backend
Optimized for Vercel deployment with security headers delegated to vercel.json
"""
from flask import Flask, render_template, send_from_directory, request, jsonify, make_response, g
from functools import wraps
import os
import secrets
import re
import time

app = Flask(__name__, 
            template_folder='../templates',
            static_folder='../static')

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================
# Detect development mode (local) vs production (Vercel)
IS_PRODUCTION = bool(os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV'))
IS_DEVELOPMENT = not IS_PRODUCTION

# Force production mode on Vercel
if IS_PRODUCTION:
    app.debug = False
    app.config['ENV'] = 'production'

# Secret key for session security
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# =============================================================================
# CACHE BUSTING FOR DEVELOPMENT
# =============================================================================
@app.context_processor
def inject_cache_bust():
    """Inject cache bust timestamp for development mode"""
    if IS_DEVELOPMENT:
        # Use current timestamp to bust cache on every page load
        return {'cache_bust': f'?v={int(time.time())}'}
    else:
        # In production, use a stable version string
        return {'cache_bust': '?v=3.5'}

# =============================================================================
# NONCE GENERATION FOR CSP
# =============================================================================
@app.before_request
def generate_csp_nonce():
    """Generate a unique nonce for each request for CSP script-src"""
    g.csp_nonce = secrets.token_urlsafe(32)

# =============================================================================
# SECURITY HEADERS (Only CSP with nonce, rest delegated to vercel.json)
# =============================================================================
@app.after_request
def add_security_headers(response):
    nonce = getattr(g, 'csp_nonce', secrets.token_urlsafe(32))
    
    # CSP with dynamic nonce (can't be in vercel.json)
    csp_directives = [
        "default-src 'self'",
        f"script-src 'self' 'nonce-{nonce}' https://www.googletagmanager.com https://www.google-analytics.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' https: data:",
        "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "script-src-attr 'none'"
        # NOTE: upgrade-insecure-requests and block-all-mixed-content 
        # are in vercel.json for production only (breaks local HTTP testing)
    ]
    response.headers['Content-Security-Policy'] = '; '.join(csp_directives)
    
    # Cache control for dynamic vs static content
    if request.path.startswith('/static/'):
        if IS_DEVELOPMENT:
            # No cache in development for easier testing
            response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        else:
            response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
    else:
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    
    # Remove server identification
    response.headers.pop('Server', None)
    response.headers.pop('X-Powered-By', None)
    
    return response

# =============================================================================
# CONTACT FORM VALIDATION
# =============================================================================
def validate_email(email):
    """Simple email validation"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_contact_form(data):
    """Validate contact form data"""
    errors = []
    
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()
    honeypot = data.get('website', '').strip()  # Honeypot field
    
    # Check honeypot (should be empty for real users)
    if honeypot:
        return None, ['Bot detected']
    
    if not name or len(name) < 2:
        errors.append('Name must be at least 2 characters')
    if len(name) > 100:
        errors.append('Name is too long')
    
    if not email or not validate_email(email):
        errors.append('Valid email is required')
    
    if not message or len(message) < 10:
        errors.append('Message must be at least 10 characters')
    if len(message) > 2000:
        errors.append('Message is too long (max 2000 characters)')
    
    if errors:
        return None, errors
    
    return {'name': name, 'email': email, 'message': message}, None

# =============================================================================
# ROUTES
# =============================================================================
@app.route('/')
def index():
    """Render the main portfolio page with CSP nonce"""
    return render_template('index.html', csp_nonce=g.csp_nonce)

@app.route('/privacy')
def privacy():
    """Render privacy policy page"""
    return render_template('privacy.html', csp_nonce=g.csp_nonce)

@app.route('/api/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        data = request.get_json() or request.form.to_dict()
        validated_data, errors = validate_contact_form(data)
        
        if errors:
            return jsonify({'success': False, 'errors': errors}), 400
        
        # In production, you would send an email or save to database here
        # For now, we just acknowledge receipt
        # Example: send_email(validated_data['name'], validated_data['email'], validated_data['message'])
        
        return jsonify({
            'success': True, 
            'message': '¡Gracias por tu mensaje! Te responderé pronto.'
        })
    except Exception:
        return jsonify({'success': False, 'errors': ['Error processing request']}), 500

@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files with security headers"""
    return send_from_directory(app.static_folder, path)

@app.route('/robots.txt')
def robots():
    """Serve robots.txt"""
    return send_from_directory(app.static_folder, 'robots.txt', mimetype='text/plain')

@app.route('/sitemap.xml')
def sitemap():
    """Serve sitemap.xml"""
    return send_from_directory(app.static_folder, 'sitemap.xml', mimetype='application/xml')

@app.route('/favicon.ico')
def favicon():
    """Serve favicon"""
    return send_from_directory(app.static_folder, 'favicon.svg', mimetype='image/svg+xml')

@app.route('/.well-known/security.txt')
def security_txt():
    """Serve security.txt per RFC 9116"""
    return send_from_directory(app.static_folder, '.well-known/security.txt', mimetype='text/plain')

# =============================================================================
# SECURITY REPORTING ENDPOINTS
# =============================================================================
@app.route('/api/csp-report', methods=['POST'])
def csp_report():
    """Endpoint to receive CSP violation reports"""
    return '', 204

@app.route('/api/security-report', methods=['POST'])
def security_report():
    """Generic security report endpoint"""
    return '', 204

# =============================================================================
# ERROR HANDLERS
# =============================================================================
@app.errorhandler(400)
def bad_request(e):
    """Handle 400 errors"""
    return render_template('404.html'), 400

@app.errorhandler(403)
def forbidden(e):
    """Handle 403 errors"""
    return render_template('404.html'), 403

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return render_template('404.html'), 404

@app.errorhandler(405)
def method_not_allowed(e):
    """Handle 405 errors"""
    return render_template('404.html'), 405

@app.errorhandler(429)
def too_many_requests(e):
    """Handle rate limit errors"""
    response = make_response(jsonify(error="Too many requests. Please try again later."), 429)
    response.headers['Retry-After'] = '60'
    return response

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors - never expose internal details"""
    return render_template('500.html'), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Catch-all error handler - prevent any information leakage"""
    return render_template('500.html'), 500

# =============================================================================
# LOCAL DEVELOPMENT ONLY
# =============================================================================
if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    if os.environ.get('VERCEL'):
        debug_mode = False
    app.run(debug=debug_mode, host='127.0.0.1', port=5000)
