/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/letter-picker-wheel",
        destination: "/random-letter-picker",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
