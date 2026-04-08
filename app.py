"""
Dark Luxury Portfolio - Local Development Server
Run with: python app.py

For production, use Vercel deployment (vercel.json)
"""
import os
import socket

def get_local_ip():
    """Get the local IP address for network access"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == '__main__':
    # Import app only when running locally
    from api.index import app
    
    local_ip = get_local_ip()
    
    # Debug mode from environment, defaults to FALSE for security
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    
    print("🚀 Portfolio Server Running!")
    print(f"   Local:   http://127.0.0.1:5000")
    print(f"   Network: http://{local_ip}:5000")
    print(f"   Debug:   {'ON' if debug_mode else 'OFF'}")
    print("\n   Press CTRL+C to stop the server\n")
    
    # Disable template caching for development
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.jinja_env.auto_reload = True
    
    # Use 0.0.0.0 to allow access from other devices on network
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
