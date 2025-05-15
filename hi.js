module.exports = {
  config: {
    name: "hi",
    version: "1.0",
    author: "GoatBot Tester",
    countDown: 3,
    role: 0,
    usePrefix: false,
    shortDescription: "Say hi",
    longDescription: "Replies with a greeting message",
    category: "fun",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    message.reply("Hello! This command works without a prefix.");
  }
};
