const fs = require("fs/promises");
const { CommandNotFoundError } = require("./errors");
const CommandExecutor = require("./commandExecutor");

async function main() {
  const fileHandler = await fs.open("./command.txt");

  const watcher = fs.watch("./command.txt");
  const commandExecutor = new CommandExecutor();
  fileHandler.on("change", async () => {
    console.log("Change detected in command.txt ...");
    const { size } = await fileHandler.stat();
    let buff = Buffer.alloc(size);
    const offset = 0;
    const position = 0;
    ({ buffer: buff } = await fileHandler.read(buff, offset, size, position));
    const command = buff.toString("utf-8");
    try {
      await commandExecutor.executeCommand(command);
    } catch (e) {
      if (e instanceof CommandNotFoundError) {
        return console.log("\x1b[31m", e.message);
      }
      console.error(e);
    }
  });

  console.log("Watching command.txt");
  let waitingPeriod = false;
  let event;
  for await (event of watcher) {
    // throttle the rate of events triggers
    if (waitingPeriod) {
      continue;
    }
    waitingPeriod = true;
    setTimeout(() => {
      fileHandler.emit(event.eventType);
      waitingPeriod = false;
    }, 500);
  }
}

main();
