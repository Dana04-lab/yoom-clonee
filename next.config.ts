/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint қатесін өткізіп жібереді
  },
};

module.exports = nextConfig;
