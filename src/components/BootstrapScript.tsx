'use client';

import { useEffect } from 'react';

export default function BootstrapScript() {
  useEffect(() => {
    // Import Bootstrap JavaScript dynamically with proper error handling
    const loadBootstrap = async () => {
      try {
        // Check if Bootstrap is already loaded
        if (typeof window !== 'undefined' && (window as any).bootstrap) {
          console.log('Bootstrap already loaded');
          return;
        }

        console.log('Loading Bootstrap JavaScript...');
        const bootstrap = await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        
        // Make Bootstrap available globally
        if (typeof window !== 'undefined') {
          (window as any).bootstrap = bootstrap;
        }
        
        console.log('Bootstrap JavaScript loaded successfully');
      } catch (error) {
        console.error('Failed to load Bootstrap JavaScript:', error);
      }
    };
    
    loadBootstrap();
  }, []);

  return null;
}
