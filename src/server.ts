import { ENV } from './config/env';
import app from './app';

app.listen(ENV.PORT, () => {
  console.log(`Server is running at http://localhost:${ENV.PORT}`);
});

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! Server dimatikan secara paksa...');
  console.error(err.name, err.message);
  process.exit(1);
});

const server = app.listen(ENV.PORT, () => {
  console.log(`Server berjalan optimal pada http://localhost:${ENV.PORT}`);
  console.log(`Environment: ${ENV.NODE_ENV}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! Melakukan graceful shutdown...');
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
