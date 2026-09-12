class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
    this.code = 'ERR_NOT_FOUND';
  }
}
