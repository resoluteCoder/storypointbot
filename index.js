const { getTicketById } = require('./api.js');
const { createTicketInfo, createPoll } = require('./blocks.js');
const dotenv = require('dotenv');
const { App } = require('@slack/bolt');

const port = process.env.PORT || 3000;

let params = {}
let scores = [
  {'name':'1', 'score':0},
  {'name':'2', 'score':0},
  {'name':'5', 'score':0},
  {'name':'8', 'score':0},
  {'name':'13', 'score':0},
]

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
  params = { icon_emoji: ':robot_face:', blocks: [], text: 'received' };
  params.blocks.push(...createTicketInfo(ticketInfo));
  params.blocks.push(...createPoll(scores).flat());

  await say(params);
});

app.action(/actionId-[0-9]*/, async ({ body, ack, say, respond }) => {
  await ack();
  const buttonKey = body.message.blocks.find(block => block.block_id === body.actions[0].block_id).elements[0].value
  scores.filter(score =>{
    if (score.name === buttonKey){
      score.score++
    }
  })
  params.blocks.find(block => block.block_id === buttonKey).elements[0].text = `${scores.find(score => score.name === buttonKey).score} votes`
  
  respond({
    ...params
  })
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
