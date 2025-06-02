module.exports = {
  apps: [
    {
      name: 'vivaan-backend',
      script: './BACKEND/app.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '300M',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      time: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
}; 