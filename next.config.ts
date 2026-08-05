/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utqsyxldydpoaglnhfsl.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;