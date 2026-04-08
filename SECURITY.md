# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately:

1. **DO NOT** create a public GitHub issue
2. Email: carlosmolina.contact@gmail.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

You will receive a response within 48 hours.

## Security Measures Implemented

This project implements comprehensive security measures:

### HTTP Security Headers
- **Content-Security-Policy (CSP)**: Strict policy with nonces for scripts
- **Strict-Transport-Security (HSTS)**: 2-year duration with preload
- **X-Frame-Options**: DENY (no framing allowed)
- **X-Content-Type-Options**: nosniff
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Cross-Origin-Embedder-Policy**: require-corp
- **Cross-Origin-Opener-Policy**: same-origin
- **Cross-Origin-Resource-Policy**: same-origin
- **Permissions-Policy**: All sensitive APIs blocked (27+ features)
- **X-Download-Options**: noopen
- **X-Permitted-Cross-Domain-Policies**: none
- **X-DNS-Prefetch-Control**: off

### Rate Limiting
- 60 requests per minute per IP
- 10 requests per second burst limit
- Client fingerprinting using IP + User-Agent hash

### Privacy Protection
- Email/phone obfuscated from structured data
- AI crawlers blocked in robots.txt (GPTBot, CCBot, ChatGPT-User, etc.)
- No PII in client-side accessible sources

### Error Handling
- Custom error pages (no stack traces exposed)
- Catch-all exception handler
- Generic error messages to prevent information leakage

### Deployment Security
- Debug mode disabled by default and forced off in production
- Environment variable validation
- Secret key requirement for sessions

## Security.txt

This project follows RFC 9116 with a security.txt file at:
`/.well-known/security.txt`

## Security Audit

Last security audit: January 7, 2026
Audit methodology: OWASP Top 10 2021

## Third-Party Dependencies

Dependencies are regularly updated. Current versions:
- Flask 3.0.0
- Werkzeug 3.0.1

Use `pip-audit` or similar tools to check for vulnerabilities:
```bash
pip install pip-audit
pip-audit
```
