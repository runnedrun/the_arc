/** @type {import('next').NextConfig} */

const config = {
  experimental: { esmExternals: true },
  reactStrictMode: false,

  webpack: (configToModify) => {
    configToModify.resolve.fallback = {
      fs: false,
      path: false,
      child_process: false,
      net: false,
      tls: false,
      crypto: false,
      http: false,
      http2: false,
      https: false,
      zlib: false,
      stream: false,
      util: false,
      os: false,
      assert: false,
      buffer: false,
      constants: false,
      events: false,
      module: false,
      process: false,
      querystring: false,
      request: false,
      url: false,
      vm: false,
      worker_threads: false,
    }
    return configToModify
  },
  images: {
    domains: ["localhost", "firebasestorage.googleapis.com"],
  },
}

export default config
