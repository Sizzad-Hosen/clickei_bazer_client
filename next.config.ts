/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'example.com',
      'res.cloudinary.com',
      'encrypted-tbn0.gstatic.com',
      'via.placeholder.com',
      "static.vecteezy.com",
      'cdn.pixabay.com'
    ],
  },
};

module.exports = nextConfig;
