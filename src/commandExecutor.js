const fs = require("fs/promises");
const { CommandNotFoundError } = require("./errors");

class CommandExecutor {
  CREATE_FILE = "create a file";
  DELETE_FILE = "delete the file";
  RENAME_FILE = "rename the file";
  ADD_CONTENT_TO_FILE = "add content to file";

  async _create_file(path) {
    const sanitisedPath = path.trim();
    console.log(`Creating file ${path}`);
    await fs.writeFile(sanitisedPath, "");
  }
  async _delete_file(path) {
    const sanitisedPath = path.trim();
    console.log(`Deleting the file ${sanitisedPath}`);
    try {
      await fs.rm(sanitisedPath);
    } catch (e) {
      console.log("File path doesn't exist");
    }
  }
  async _rename_file(data) {
    const [oldPath, newPath] = data.split(",").map((data) => data.trim());
    console.log(`Renaming the file ${oldPath} to ${newPath}`);
    try {
      await fs.rename(oldPath, newPath);
    } catch (e) {
      console.log("File path doesn't exist");
    }
  }
  async _addContentToFile(data) {
    const [path, content] = data.split(",").map((data) => data.trim());
    console.log(`Adding content to file ${path}`);
    await fs.appendFile(path, content);
  }

  async executeCommand(content) {
    const [command, data] = content.split(":");
    const sanitisedCommand = command.trim().toLowerCase();
    switch (sanitisedCommand) {
      case this.CREATE_FILE:
        return await this._create_file(data);
      case this.DELETE_FILE:
        return await this._delete_file(data);
      case this.RENAME_FILE:
        return await this._rename_file(data);
      case this.ADD_CONTENT_TO_FILE:
        return await this._addContentToFile(data);
      default:
        throw new CommandNotFoundError(command);
    }
  }
}

module.exports = CommandExecutor;
