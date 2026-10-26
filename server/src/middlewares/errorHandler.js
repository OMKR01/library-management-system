/**
 * Global error handler middleware.
 * Catches any unhandled errors thrown in route handlers.
 */
export function errorHandler(err, _req, res, _next) {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}
