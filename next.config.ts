import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  output: "export", // 👈 Netlify үшін маңызды
};

export default nextConfig;
