import { ENV } from './config/env.js';
import app from './app.js';

// app.listen(ENV.PORT, () => {
//   console.log(`Server is running at http://localhost:${ENV.PORT}`);
// });

process.on('uncaughtException', (err: Error) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down immediately...');
  console.error(err.name, err.message);
  process.exit(1);
});

const server = app.listen(ENV.PORT, () => {
  console.log(`🚀 Server is running perfectly at http://localhost:${ENV.PORT}`);
  console.log(`👉 Environment: ${ENV.NODE_ENV}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('💥 UNHANDLED REJECTION! Performing graceful shutdown...');
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
