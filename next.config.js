/** @type {import('next').NextConfig} */
// NOTE: For GitHub Pages user/project sites, the URL is usually:
//   https://<username>.github.io/<repo-name>/
// Set BASE_PATH to "/<repo-name>" when deploying to a project page.
// For a custom domain or a username.github.io root repo, leave it blank.
const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? basePath : '',
  assetPrefix: isProd ? basePath : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? basePath : '',
  },
};

module.exports = nextConfig;
