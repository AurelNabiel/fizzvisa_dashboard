/** @type {import('next').NextConfig} */

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH && process.env.NEXT_PUBLIC_BASE_PATH !== "/"
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "";

const nextConfig = {
  basePath: basePath,
  images: {
    domains: ["203.145.34.100"],
  },

  async rewrites() {
    return [
      {
        source: "/admin/images/:path*",
        destination: "/images/:path*",
      },
    ];
  },
};

export default nextConfig;
