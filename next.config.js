/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost/3000", "lh3.googleusercontent.com"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig