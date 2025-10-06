/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },

  webpack: (config, { isServer }) => {
    // Fix "canvas.node" error when using pdfjs-dist
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false, // tells Webpack to ignore native canvas
        fs: false,     // extra safety for file-system calls on client
        path: false,   // some libs try to use path on client
        os: false,     // OS module not available on client
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
      };
    }
    
    // Ignore problematic modules completely
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.node$/,
          use: 'raw-loader',
        },
        {
          test: /canvas/,
          use: 'null-loader',
        },
      ],
    };
    
    return config;
  },
};

module.exports = nextConfig;
