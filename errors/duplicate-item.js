module.exports = class DuplicateItemError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
