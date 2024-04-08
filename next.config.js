/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['c.saavncdn.com','static.saavncdn.com','www.jiosaavn.com'],
    },
    env: {
      API_BASE_URL: "https://hayasaka-64ccjl6qs-musicly-ai.vercel.app/"
    }
}




const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
  });
  
  module.exports = withPWA({
    reactStrictMode: true,
    env: {
      API_BASE_URL: "https://hayasaka-64ccjl6qs-musicly-ai.vercel.app/"
    }
  });

module.exports = nextConfig