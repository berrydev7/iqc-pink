/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ensure we can run API routes without strict timeout limits if needed
  experimental: {
    serverComponentsExternalPackages: ["@napi-rs/canvas"]
  }
};

export default nextConfig;
