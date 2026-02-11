module.exports = {
  apps: [
    {
      name: "drawing-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 4001",
      cwd: "/var/www/html/Drawing/Drawing_Internal/frontend",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
