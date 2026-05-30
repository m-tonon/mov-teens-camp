/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/perfil', destination: '/deepfake', permanent: false },
      { source: '/generate', destination: '/admin/generate', permanent: false },
    ];
  },
}

export default nextConfig
