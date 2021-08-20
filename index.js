const SlackBot = require('slackbots');
const axios = require('axios');
const dotenv = require('dotenv');
const customMessage = require('./block.json');

dotenv.config();

let count = 0;
const bot = new SlackBot({
  token: `${process.env.BOT_TOKEN}`,
  name: 'storypointbot',
});

// Start Handler
bot.on('start', () => {});

// Error Handler
bot.on('error', (err) => {
  console.log(err);
});

// Message Handler
bot.on('message', (data) => {
  if (data.type !== 'message') {
    return;
  }
  console.log('received message');

  handleTestMessage(data);
});

const handleTestMessage = (data) => {
  console.log(data.user);
  bot.getUserById(data.user).then((userData) => {
    bot.postMessageToChannel(
      'random',
      `@${userData.real_name} said ${data.text.split(' ')[1]}`,
      customMessage
    );
  });
};
