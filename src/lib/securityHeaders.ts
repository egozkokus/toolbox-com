// Security Headers Configuration for Tools4Anything
// Implements comprehensive security policies

interface SecurityHeaders {
    [key: string]: string;
}

interface CSPDirectives {
    [key: string]: string[];
}

class SecurityHeadersManager {
    private readonly isDevelopment = process.env.NODE_ENV === 'development';

    // Content Security Policy directives
    private readonly cspDirectives: CSPDirectives = {
      'default-src': ["'self'"],
      // WARNING: 'unsafe-eval' is needed for development mode in some frameworks.
      // It should be removed for production if possible.
      'script-src': [
        "'self'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://cdnjs.cloudflare.com',
        // In a strict production environment, you would remove 'unsafe-eval'
        ...(this.isDevelopment ? ["'unsafe-eval'"] : [])
      ],
      // WARNING: 'unsafe-inline' is often required for frameworks that inject styles.
      // A stricter policy would require using nonces or hashes.
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Kept for compatibility with UI libraries, but ideally should be removed.
        'https://fonts.googleapis.com',
        'https://cdnjs.cloudflare.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:', // Allows images from any HTTPS source
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com'
      ],
      'connect-src': [
        "'self'",
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://www.googletagmanager.com',
        'https://api.tools4anything.com',
        'wss://tools4anything.com',
        ...(this.isDevelopment ? ['ws://localhost:*', 'http://localhost:*'] : [])
      ],
      'media-src': ["'self'", 'blob:'],
      'object-src': ["'none'"],
      'child-src': ["'self'", 'blob:'],
      'frame-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'form-action': ["'self'"],
      'base-uri': ["'self'"],
      'manifest-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'upgrade-insecure-requests': [],
      'block-all-mixed-content': []
    };

    private generateCSP(): string {
      const policies = Object.entries(this.cspDirectives)
        .map(([directive, sources]) => {
          if (sources.length === 0) {
            return directive;
          }
          return `${directive} ${sources.join(' ')}`;
        })
        .join('; ');

      return policies;
    }

    public getHeaders(): SecurityHeaders {
      const headers: SecurityHeaders = {
        'Content-Security-Policy': this.generateCSP(),
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': this.getPermissionsPolicy(),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Expect-CT': 'max-age=86400, enforce',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'same-origin'
      };

      return headers;
    }

    private getPermissionsPolicy(): string {
      const policies = {
        'accelerometer': ['()'],
        'ambient-light-sensor': ['()'],
        'autoplay': ['(self)'],
        'camera': ['()'],
        'clipboard-read': ['(self)'],
        'clipboard-write': ['(self)'],
        'fullscreen': ['(self)'],
        'geolocation': ['()'],
        'microphone': ['()'],
        'payment': ['()'],
        'interest-cohort': ['()'], // Opt-out of Google's FLoC
      };

      return Object.entries(policies)
        .map(([feature, allowList]) => `${feature}=${allowList.join(' ')}`)
        .join(', ');
    }
    
    // ... (rest of the class remains the same)
}

const securityHeadersManager = new SecurityHeadersManager();
export default securityHeadersManager;