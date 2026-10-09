import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // Raise the body size limit so gallery images up to 8 MB can be uploaded
    // via the /api/upload route handler.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
