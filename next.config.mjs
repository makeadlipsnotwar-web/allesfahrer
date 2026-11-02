/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.dream-print.de',
      },
    ],
  },
};

export default nextConfig;
