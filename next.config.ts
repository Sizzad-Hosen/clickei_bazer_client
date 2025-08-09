// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'example.com',          // add your image host here
      'res.cloudinary.com',   // add other hosts as needed
      'encrypted-tbn0.gstatic.com',
    ],
  },
};

module.exports = nextConfig;
