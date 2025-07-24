/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // disable Turbopack
  },
  images: {
    domains: ['res.cloudinary.com', 'example.com'], // 👈 allow both domains
  },
};

module.exports = nextConfig;
