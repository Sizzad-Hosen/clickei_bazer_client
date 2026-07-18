/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      'https://example.com/**',
      'https://res.cloudinary.com/**',
      'https://encrypted-tbn0.gstatic.com/**',
      'https://via.placeholder.com/**',
      'https://static.vecteezy.com/**',
      'https://cdn.pixabay.com/**',
    ].map((url) => new URL(url)),
  },
};

module.exports = nextConfig;
