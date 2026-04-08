"""
Portfolio App Tests
Basic tests for routes and functionality
"""
import pytest


class TestRoutes:
    """Test main routes return correct status codes"""
    
    def test_index_returns_200(self, client):
        """Test that the index page loads"""
        response = client.get('/')
        assert response.status_code == 200
    
    def test_privacy_returns_200(self, client):
        """Test that privacy page loads"""
        response = client.get('/privacy')
        assert response.status_code == 200
    
    def test_robots_txt_returns_200(self, client):
        """Test that robots.txt is served"""
        response = client.get('/robots.txt')
        assert response.status_code == 200
        assert b'User-agent' in response.data
    
    def test_sitemap_returns_200(self, client):
        """Test that sitemap.xml is served"""
        response = client.get('/sitemap.xml')
        assert response.status_code == 200
    
    def test_404_on_unknown_route(self, client):
        """Test that unknown routes return 404"""
        response = client.get('/nonexistent-page')
        assert response.status_code == 404


class TestContactForm:
    """Test contact form endpoint"""
    
    def test_contact_requires_post(self, client):
        """Test that contact endpoint only accepts POST"""
        response = client.get('/api/contact')
        assert response.status_code == 405
    
    def test_contact_validates_empty_data(self, client):
        """Test that empty data is rejected"""
        response = client.post('/api/contact', 
                              json={},
                              content_type='application/json')
        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False
    
    def test_contact_validates_email(self, client):
        """Test that invalid email is rejected"""
        response = client.post('/api/contact',
                              json={
                                  'name': 'Test User',
                                  'email': 'invalid-email',
                                  'message': 'This is a test message with enough characters.'
                              },
                              content_type='application/json')
        assert response.status_code == 400
    
    def test_contact_validates_short_message(self, client):
        """Test that short message is rejected"""
        response = client.post('/api/contact',
                              json={
                                  'name': 'Test User',
                                  'email': 'test@example.com',
                                  'message': 'Short'
                              },
                              content_type='application/json')
        assert response.status_code == 400
    
    def test_contact_accepts_valid_data(self, client):
        """Test that valid data is accepted"""
        response = client.post('/api/contact',
                              json={
                                  'name': 'Test User',
                                  'email': 'test@example.com',
                                  'message': 'This is a valid test message with enough characters.'
                              },
                              content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] == True
    
    def test_honeypot_rejects_bots(self, client):
        """Test that honeypot field rejects bots"""
        response = client.post('/api/contact',
                              json={
                                  'name': 'Test User',
                                  'email': 'test@example.com',
                                  'message': 'This is a valid test message.',
                                  'website': 'http://spam.com'  # Honeypot filled
                              },
                              content_type='application/json')
        assert response.status_code == 400


class TestSecurityHeaders:
    """Test that security headers are present"""
    
    def test_csp_header_present(self, client):
        """Test that CSP header is set"""
        response = client.get('/')
        assert 'Content-Security-Policy' in response.headers
    
    def test_cache_control_on_html(self, client):
        """Test that HTML pages have no-cache headers"""
        response = client.get('/')
        assert 'no-cache' in response.headers.get('Cache-Control', '') or \
               'no-store' in response.headers.get('Cache-Control', '')


class TestStaticFiles:
    """Test static file serving"""
    
    def test_css_file_served(self, client):
        """Test that CSS file is accessible"""
        response = client.get('/static/css/style.css')
        assert response.status_code == 200
    
    def test_js_file_served(self, client):
        """Test that JS file is accessible"""
        response = client.get('/static/js/script.js')
        assert response.status_code == 200
    
    def test_favicon_served(self, client):
        """Test that favicon is accessible"""
        response = client.get('/favicon.ico')
        assert response.status_code == 200
