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
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for React
        "'unsafe-eval'", // Required for development only
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://cdnjs.cloudflare.com',
        ...(this.isDevelopment ? ["'unsafe-eval'"] : [])
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for styled components
        'https://fonts.googleapis.com',
        'https://cdnjs.cloudflare.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
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
        'wss://tools4anything.com', // WebSocket support
        ...(this.isDevelopment ? ['ws://localhost:*'] : [])
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
  
    // Generate CSP header string
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
  
    // Generate nonce for inline scripts (if needed)
    public generateNonce(): string {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode(...array));
    }
  
    // Get all security headers
    public getHeaders(): SecurityHeaders {
      const headers: SecurityHeaders = {
        // Content Security Policy
        'Content-Security-Policy': this.generateCSP(),
        
        // Prevent clickjacking
        'X-Frame-Options': 'DENY',
        
        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',
        
        // Enable XSS filter (for older browsers)
        'X-XSS-Protection': '1; mode=block',
        
        // Referrer Policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        
        // Permissions Policy (formerly Feature Policy)
        'Permissions-Policy': this.getPermissionsPolicy(),
        
        // HSTS (Strict Transport Security)
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        
        // Expect-CT (Certificate Transparency)
        'Expect-CT': 'max-age=86400, enforce',
        
        // Cross-Origin policies
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'same-origin'
      };
  
      return headers;
    }
  
    // Permissions Policy configuration
    private getPermissionsPolicy(): string {
      const policies = {
        'accelerometer': ['()'],
        'ambient-light-sensor': ['()'],
        'autoplay': ['(self)'],
        'battery': ['()'],
        'camera': ['()'],
        'clipboard-read': ['(self)'],
        'clipboard-write': ['(self)'],
        'display-capture': ['()'],
        'document-domain': ['()'],
        'encrypted-media': ['()'],
        'fullscreen': ['(self)'],
        'geolocation': ['()'],
        'gyroscope': ['()'],
        'interest-cohort': ['()'], // Opt out of FLoC
        'magnetometer': ['()'],
        'microphone': ['()'],
        'midi': ['()'],
        'payment': ['()'],
        'picture-in-picture': ['(self)'],
        'publickey-credentials-get': ['()'],
        'screen-wake-lock': ['()'],
        'sync-xhr': ['()'],
        'usb': ['()'],
        'xr-spatial-tracking': ['()']
      };
  
      return Object.entries(policies)
        .map(([feature, allowList]) => `${feature}=${allowList.join(' ')}`)
        .join(', ');
    }
  
    // Apply headers to Express app
    public applyToExpress(app: any): void {
      app.use((req: any, res: any, next: any) => {
        const headers = this.getHeaders();
        
        Object.entries(headers).forEach(([header, value]) => {
          res.setHeader(header, value);
        });
        
        next();
      });
    }
  
    // Generate meta tags for client-side security
    public generateMetaTags(): string[] {
      return [
        '<meta http-equiv="X-Content-Type-Options" content="nosniff">',
        '<meta http-equiv="X-Frame-Options" content="DENY">',
        '<meta http-equiv="X-XSS-Protection" content="1; mode=block">',
        '<meta name="referrer" content="strict-origin-when-cross-origin">'
      ];
    }
  
    // Validate CSP violations report
    public validateCSPReport(report: any): boolean {
      const requiredFields = [
        'csp-report',
        'document-uri',
        'violated-directive',
        'blocked-uri'
      ];
  
      if (!report || typeof report !== 'object') {
        return false;
      }
  
      const cspReport = report['csp-report'];
      if (!cspReport || typeof cspReport !== 'object') {
        return false;
      }
  
      return requiredFields.every(field => 
        field in cspReport || field in report
      );
    }
  
    // Handle CSP violation reports
    public handleCSPReport(report: any): void {
      if (!this.validateCSPReport(report)) {
        console.error('Invalid CSP report received');
        return;
      }
  
      const violation = report['csp-report'] || report;
      
      // Log to monitoring
      const violationData = {
        timestamp: new Date().toISOString(),
        documentUri: violation['document-uri'],
        violatedDirective: violation['violated-directive'],
        blockedUri: violation['blocked-uri'],
        lineNumber: violation['line-number'],
        columnNumber: violation['column-number'],
        sourceFile: violation['source-file'],
        referrer: violation['referrer'],
        userAgent: violation['user-agent'] || 'unknown'
      };
  
      // Send to monitoring service
      if (window.gtag) {
        window.gtag('event', 'csp_violation', {
          event_category: 'Security',
          event_label: violation['violated-directive'],
          value: 1,
          custom_map: violationData
        });
      }
  
      // Log in development
      if (this.isDevelopment) {
        console.warn('CSP Violation:', violationData);
      }
    }
  }
  
  // Export singleton instance
  const securityHeadersManager = new SecurityHeadersManager();
  export default securityHeadersManager;
  
  // Export for server-side usage
  export { SecurityHeadersManager, SecurityHeaders, CSPDirectives };
  
  // Middleware for Express.js
  export function securityHeadersMiddleware(req: any, res: any, next: any): void {
    securityHeadersManager.applyToExpress({ use: (fn: any) => fn(req, res, next) });
  }
  
  // React Hook for CSP nonce
  export function useCSPNonce(): string {
    const [nonce] = React.useState(() => securityHeadersManager.generateNonce());
    return nonce;
  }