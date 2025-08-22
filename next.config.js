/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'admin-viencn.anf-technology.com', 'viencongnghe.com'],
  },
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/research',
        destination: '/library',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
