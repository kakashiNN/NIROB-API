const fs = require("fs");
const login = require("fb-chat-api");

// Load config & language
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
const language = JSON.parse(fs.readFileSync(`./language/${config.language}.lang`, "utf-8"));

// Anti-tamper check
if (
  config.author !== "MAHABUB RAHMAN" ||
  config.OWNER[0] !== "100014754734049" ||
  config.OPERATOR[0] !== "100014754734049" ||
  config.CONTACT !== "https://www.facebook.com/www.xnxx.com140"
) {
  console.error(language.author_error || "Unauthorized config modification detected. Bot shutting down...");
  process.exit(1);
}

// Load all commands
const commands = new Map();
fs.readdirSync("./MAHABUB/commands").forEach(file => {
  const cmd = require(`./MAHABUB/commands/${file}`);
  commands.set(cmd.config.name, cmd);
});

// Choose login method
const loginOption = config.ACCESS
  ? { email: config.EMAIL, password: config.PASSWORD }
  : { appState: JSON.parse(fs.readFileSync(config.FBSTATE_PATH, "utf-8")) };

// Login to Messenger
login(loginOption, (err, api) => {
  if (err) {
    console.error(language.login_failed || "Login failed:", err);
    return;
  }

  console.log(`[${config.BOTNAME}] is running...`);

  api.listenMqtt((err, event) => {
    if (err || event.type !== "message" || !event.body) return;

    for (const cmd of commands.values()) {
      const trigger = config.PREFIX + cmd.config.name;
      const isTriggered = cmd.config.allowPrefix
        ? event.body.startsWith(trigger)
        : event.body === cmd.config.name;

      if (!isTriggered) continue;

      const senderID = event.senderID;
      const permission = cmd.config.permission;

      // adminOnly toggle (only admin can use any command)
      if (config.adminOnly && !config.ADMINBOT.includes(senderID)) {
        return api.sendMessage(language.no_admin_access, event.threadID);
      }

      // Permission check
      if (
        permission === 1 && !config.OPERATOR.includes(senderID) ||
        permission === 2 && !(config.OPERATOR.includes(senderID) || config.ADMINBOT.includes(senderID))
      ) {
        return api.sendMessage(language.no_permission, event.threadID);
      }

      try {
        cmd.run({ api, event, config, language });
      } catch (e) {
        api.sendMessage(language.command_error || "Something went wrong executing this command.", event.threadID);
        console.error(e);
      }

      break;
    }
  });
});
