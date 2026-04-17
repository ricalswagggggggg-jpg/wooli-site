/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "us.caidan2.com"
      },
      {
        protocol: "https",
        hostname: "image.minapp.xin"
      }
    ]
  }
};

export default nextConfig;
