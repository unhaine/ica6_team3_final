import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'recipe1.ezmember.co.kr',
        port: '',
        pathname: '/cache/recipe/**',
      },
    ],
  },
};

export default nextConfig;
