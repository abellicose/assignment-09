const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            }
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://assignment-09-sigma.vercel.app/api/:path*",
            },
        ];
    },
};
export default nextConfig;
