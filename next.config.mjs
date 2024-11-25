/** @type {import('next').NextConfig} */

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH && process.env.NEXT_PUBLIC_BASE_PATH !== "/"
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "";

const nextConfig = {
  basePath : basePath,
  // Remove the redirects function entirely to avoid conflicts
};

export default nextConfig;
