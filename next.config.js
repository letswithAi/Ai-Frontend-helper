/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental flags for stability
  reactStrictMode: true,

  // Add this if you need image optimization
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
