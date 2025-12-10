/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com', // Unsplash premium photos
      'media.istockphoto.com',
      'via.placeholder.com',
    ],
    // Remote patterns (better approach - Next.js 13+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // Unsplash premium photos
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com', // All unsplash subdomains
      },
    ],
  },
};

module.exports = nextConfig;

