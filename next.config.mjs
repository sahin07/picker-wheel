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
    /**
     * Server-side permanent redirects (308 via Next/Vercel edge).
     * Old / previous / legacy slugs → current canonical pillars only.
     * Query strings are preserved by default (e.g. ?preset=, ?template=).
     */
    return [
      // --- Letter picker ---
      {
        source: "/random-letter-picker",
        destination: "/spin-random-letter-picker-wheel",
        permanent: true,
      },
      {
        source: "/letter-picker-wheel",
        destination: "/spin-random-letter-picker-wheel",
        permanent: true,
      },

      // --- Yes / No picker ---
      {
        source: "/yes-or-no-wheel",
        destination: "/spin-random-yes-no-picker-wheel",
        permanent: true,
      },
      {
        source: "/yes-no-picker-wheel",
        destination: "/spin-random-yes-no-picker-wheel",
        permanent: true,
      },

      // --- Number picker ---
      {
        source: "/number-picker-wheel",
        destination: "/spin-random-number-picker-wheel",
        permanent: true,
      },

      // --- Color picker ---
      {
        source: "/color-picker-wheel",
        destination: "/spin-random-color-picker-wheel",
        permanent: true,
      },
      {
        source: "/wheel-of-colors",
        destination: "/spin-random-color-picker-wheel",
        permanent: true,
      },

      // --- Theme picker ---
      {
        source: "/theme-picker-wheel",
        destination: "/spin-random-theme-picker-wheel",
        permanent: true,
      },
      {
        source: "/random-theme-generator",
        destination: "/spin-random-theme-picker-wheel",
        permanent: true,
      },

      // --- Team picker ---
      {
        source: "/team-picker-wheel",
        destination: "/spin-random-team-picker-wheel",
        permanent: true,
      },
      {
        source: "/team-picker",
        destination: "/spin-random-team-picker-wheel",
        permanent: true,
      },
      {
        source: "/random-team-picker",
        destination: "/spin-random-team-picker-wheel",
        permanent: true,
      },

      // --- State / country ---
      {
        source: "/state-wheel",
        destination: "/spin-random-state-wheel",
        permanent: true,
      },
      {
        source: "/country-picker-wheel",
        destination: "/spin-random-country-wheel",
        permanent: true,
      },

      // --- Date / image ---
      {
        source: "/date-picker-wheel",
        destination: "/spin-random-date-picker-wheel",
        permanent: true,
      },
      {
        source: "/image-picker-wheel",
        destination: "/spin-random-image-picker-wheel",
        permanent: true,
      },

      // --- Letter spokes (legacy generators) ---
      {
        source: "/a-to-z-wheel",
        destination: "/alphabet-wheel",
        permanent: true,
      },
      {
        source: "/random-vowel-generator",
        destination: "/vowel-picker",
        permanent: true,
      },
      {
        source: "/random-consonant-generator",
        destination: "/consonant-picker",
        permanent: true,
      },

      // --- Fortune / misc ---
      {
        source: "/the-wheel-of-fortune",
        destination: "/wheel-of-fortune",
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
      {
        source: "/faq",
        destination: "/help",
        permanent: true,
      },

      // --- Raffle spin wheel aliases ---
      {
        source: "/raffle-wheel",
        destination: "/raffle-spin-wheel",
        permanent: true,
      },
      {
        source: "/giveaway-wheel",
        destination: "/raffle-spin-wheel",
        permanent: true,
      },
      {
        source: "/lucky-draw-wheel",
        destination: "/raffle-spin-wheel",
        permanent: true,
      },
      {
        source: "/random-drawing-wheel",
        destination: "/raffle-spin-wheel",
        permanent: true,
      },
      {
        source: "/winner-picker",
        destination: "/raffle-spin-wheel",
        permanent: true,
      },
      {
        source: "/random-draw-generator",
        destination: "/raffle-spin-wheel",
        permanent: true,
      },
      {
        source: "/classroom-raffle",
        destination: "/classroom-raffle-wheel",
        permanent: true,
      },
      {
        source: "/ticket-raffle-wheel",
        destination: "/classroom-raffle-wheel",
        permanent: true,
      },
      {
        source: "/charity-raffle",
        destination: "/charity-raffle-wheel",
        permanent: true,
      },
      {
        source: "/fundraiser-raffle-wheel",
        destination: "/charity-raffle-wheel",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
