const SlackBot = require('slackbots');
const dotenv = require('dotenv');
//const customMessage = require('./block.json');
const axios = require('axios');
const basicAuth = require('basic-auth');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Story point bot is listening at port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/ticket/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const { name, pass } = basicAuth(req);
  if (
    name === `${process.env.STORYPOINT_USERNAME}` &&
    pass === `${process.env.STORYPOINT_PASSWORD}`
  ) {
    console.log('successful login');
    const { data } = await axios.get(
      `https://issues.redhat.com/rest/api/2/issue/THEEDGE-${id}`,
      {
        auth: {
          username: `${process.env.JIRA_USERNAME}`,
          password: `${process.env.JIRA_PASSWORD}`,
        },
      }
    );
    return res.json({
      title: data.fields.summary,
      description: data.fields.description,
      assignee: data.fields.assignee.name,
      link: `https://issues.redhat.com/browse/THEEDGE-${id}`,
    });
  }
  return res.status(401).json({ message: 'You are not authorized' });
});

app.post('/slack/actions', async (req, res) => {
  console.log('it works!');
  try {
    const payload = JSON.parse(req.body.payload);
    console.log('###slack request is ' + payload);

    return res.send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong.');
  }
});

dotenv.config();

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
  console.log(data.text.split(' ')[1]);

  handleTestMessage(data);
});

const handleTestMessage = (data) => {
  bot.getUserById(data.user).then((userData) => {
    console.log(userData);
    bot.postMessageToChannel(
      'random',
      `@${userData.real_name} said ${data.text.split(' ')[1]}`
      //      customMessage
    );
  });
};
