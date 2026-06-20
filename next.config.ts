import type { NextConfig } from "next";

// Ponemos la URL fija para asegurar el tiro en producción. Si estás local usás localhost.
const API_URL = "https://snowboard-deodorize-bagging.ngrok-free.dev/api";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;