import { NextConfig } from "next";

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
            {
                protocol: "https",
                hostname: "i.gr-assets.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "m.media-amazon.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    experimental: {
        serverActions: {
            allowedOrigins: [
                "localhost:3008",
                "czz2p47w-3008.inc1.devtunnels.ms",
                "*.inc1.devtunnels.ms"
            ],
            bodySizeLimit: "2mb",
        },
    },
};

export default nextConfig;
