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
      {
        source: "/yes-no-picker-wheel",
        destination: "/yes-or-no-wheel",
        permanent: true,
      },
      {
        source: "/wheel-of-colors",
        destination: "/color-picker-wheel",
        permanent: true,
      },
      {
        source: "/random-name-picker",
        destination: "/",
        permanent: true,
      },
      {
        source: "/what-should-i-eat",
        destination: "/food-wheel",
        permanent: true,
      },
      {
        source: "/what-game-should-i-play",
        destination: "/game-night-wheel-of-fortune",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
