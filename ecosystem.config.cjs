module.exports = {
  apps: [
    {
      name: 'shop-phri',
      exec_mode: 'cluster',
      instances: 'max',
      script: '.output/server/index.mjs',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
