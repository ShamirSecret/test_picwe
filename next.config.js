/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },

  // SVGR
  webpack (config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    })
    
    // 忽略 pino-pretty 模块以避免构建警告
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    }
    
    return config
  },

}

module.exports = nextConfig
