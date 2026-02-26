const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.google.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.trplane.com',
      },
      {
        protocol: 'https',
        hostname: '**.compilatio.net',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: '**.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: 'icon2.cleanpng.com',
      },
      {
        protocol: 'https',
        hostname: '**.pngtree.com',
      },
      {
        protocol: 'https',
        hostname: '**.123rf.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.builtin.com',
      },
      {
        protocol: 'https',
        hostname: 'images.rawpixel.com',
      },
      {
        protocol: 'https',
        hostname: '**.cadresenmission.com',
      },
      {
        protocol: 'https',
        hostname: '**.ivanhoemines.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
      },
      {
        protocol: 'https',
        hostname: '**.institutnemo.com',
      },
      {
        protocol: 'https',
        hostname: '**.tws.edu',
      },
      {
        protocol: 'https',
        hostname: 'wio.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: '**.lecoindesentrepreneurs.fr',
      },
      {
        protocol: 'https',
        hostname: '**.ariseiip.com',
      },
    ],
  },
  // Configuration Turbopack (Next.js 16+)
  // Turbopack gère mieux les source maps par défaut
  turbopack: {},
};

export default nextConfig;
