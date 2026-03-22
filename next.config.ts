import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
        {
            source: "/",
            destination: "/login",
            permanent: true,
        },
        
    ];
},
devIndicators: false
};

export default nextConfig;
