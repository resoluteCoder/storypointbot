const { getTicketById } = require('./api.js');
const { createTicketInfo, createPoll } = require('./blocks.js');
const dotenv = require('dotenv');
const { App } = require('@slack/bolt');

const port = process.env.PORT || 3000;

dotenv.config();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Message Handler
app.command('/storypointbot', async ({ command, ack, say }) => {
  // check for one bot per ticket

  console.log(command);
  await ack();
  const ticketInfo = await getTicketById(command.text);
  const params = { icon_emoji: ':robot_face:', blocks: [], text: 'received' };
  params.blocks.push(...createTicketInfo(ticketInfo));
  params.blocks.push(...createPoll().flat());

  await say(params);
});

app.action(/actionId-[0-9]*/, async ({ body, ack, say }) => {
  console.log('ACTION BODY', body);
  await ack();
  //await say(`You pressed the number ${body.actions[0].value}`);
});

//app.view('view_1', async ({ ack, body, view, client }) => {
//  ///view_[0-9]*/
//  await ack();
//  console.log('VIEW VIEW', view);
//});

(async () => {
  // Start the app
  await app.start(port);

  console.log(`⚡️ Bolt app is running on port ${port}`);
})();
