class CommandNotFoundError extends Error {
  constructor(data) {
    super();
    this.message = `Invalid command - ${data}`;
  }
}
module.exports = {
  CommandNotFoundError,
};
