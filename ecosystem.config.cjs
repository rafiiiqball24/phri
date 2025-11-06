module.exports = {
  apps: [
    {
      name: 'phri-shop', // biar match sama app yang udah lo pakai di PM2
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
