import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    THIRD_WEB_CLIENT_ID: process.env.THIRD_WEB_CLIENT_ID,
    USDT_ADDRESS: process.env.USDT_ADDRESS,
    RWA_TOKEN_CONTRACT_ADDRESS: process.env.RWA_TOKEN_CONTRACT_ADDRESS,
    MARKETPLACE_PROXY: process.env.RWA_TOKEN_CONTRACT_ADDRESS,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rwa-test.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/uploads/*',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'rwa-test.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/uploads/*',
        search: '',
      },
    ],
  },
  experimental: {
    reactCompiler: true,
    turbo: {
      resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
      //moduleIdStrategy: 'named',
    },
    serverActions: {
      bodySizeLimit: '50mb',
    },
    optimizePackageImports: ['antd', 'recharts', 'lucide-react'],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
