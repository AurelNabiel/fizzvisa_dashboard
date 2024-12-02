/** @type {import('next').NextConfig} */

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH && process.env.NEXT_PUBLIC_BASE_PATH !== "/"
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "";

const nextConfig = {
  basePath : basePath,
  async rewrites() {
    return [
      {
       
        source: '/admin/images/:path*', // Match all requests to /admin/images/*
        destination: '/images/:path*', // Serve them from /images/* in the public folder
      },
    ];
  },
};

export default nextConfig;
