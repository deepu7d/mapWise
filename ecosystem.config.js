module.exports = {
  apps: [
    {
      name: 'mapwise-server', // The name PM2 will use
      script: './dist/server.js', // The path to your built server file
      cwd: './apps/server', // Path from root to your server app
      env_production: {
        NODE_ENV: 'production',
      },
      // PM2 will automatically load the .env file from the 'cwd' directory
    },
  ],
};