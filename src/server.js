require('dotenv').config();
const app = require('./app');

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const MAX_PORT_RETRY = 20;

function startServer(port, attempts = 0) {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempts < MAX_PORT_RETRY) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use, retrying on ${nextPort}...`);
      startServer(nextPort, attempts + 1);
      return;
    }

    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
}

startServer(DEFAULT_PORT);
