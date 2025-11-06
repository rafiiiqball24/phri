module.exports = {
  apps: [
    {
      name: 'nuxt-app',
      exec_mode: 'cluster',
      instances: 'max', // atau 1 kalau mau single instance aja
      script: '.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
