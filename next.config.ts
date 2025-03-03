import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "74.207.233.48",
                port: "8443",
                pathname: "/hrclIRP/studentimages/**",
            },
        ],
    },
};

export default nextConfig;
