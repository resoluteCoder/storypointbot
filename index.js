const SlackBot = require('slackbots');
const dotenv = require('dotenv');
//const customMessage = require('./block.json');
const axios = require('axios');
const basicAuth = require('basic-auth');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

const bot = new SlackBot({
  token: `${process.env.BOT_TOKEN}`,
  name: 'storypointbot',
});

app.listen(port, () => {
  console.log(`Story point bot is listening at port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start Handler
bot.on('start', () => {});

// Error Handler
bot.on('error', (err) => {
  console.log(err);
});

// Message Handler
bot.on('message', (data) => {
  if (data.type !== 'message' || data.bot_id) {
    return;
  }

  console.log('received message', data);
  getTicketById(data);
});

//bot.getUserById(data.user).then((userData) => {}
const getTicketById = async (messageData) => {
  //const id = messageData.text.split(' ')[1];
  const id = 958;
  try {
    const { data } = await axios.get(
      `https://issues.redhat.com/rest/api/2/issue/THEEDGE-${id}`,
      {
        auth: {
          username: `${process.env.JIRA_USERNAME}`,
          password: `${process.env.JIRA_PASSWORD}`,
        },
      }
    );
    const info = {
      title: data.fields.summary,
      description: data.fields.description,
      assignee: data.fields.assignee.name,
      link: `https://issues.redhat.com/browse/THEEDGE-${id}`,
    };
    console.log(createMessage(info));
    bot.postMessageToChannel(
      'random',
      'test',
      {
        icon_emoji: ':robot_face:',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `:ticket: ${info.title}? :ticket:`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                text: `*Assigned to ${info.assignee}* |  <${info.link}|THEEDGE-${id}>`,
                type: 'mrkdwn',
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Description*',
            },
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: `${info.description}`,
            },
          },
          {
            type: 'divider',
          },
        ],
      }
      //      customMessage
    );
  } catch (error) {
    console.log(error);
  }
};

const createMessage = ({ title, description, assignee, link }) => {
  const msgTitle = {
    type: 'section',
    text: { type: 'mrkdown', text: `*${title}?* Assigned to ${assignee}` },
  };
  return [msgTitle];
};
//app.get(`/ticket/${ticketID}`, async (req, res) => {
//  const { name, pass } = basicAuth(req);
//  if (
//    name === `${process.env.STORYPOINT_USERNAME}` &&
//    pass === `${process.env.STORYPOINT_PASSWORD}`
//  ) {
//    console.log('successful login');
//    const { data } = await axios.get(
//      `https://issues.redhat.com/rest/api/2/issue/THEEDGE-${id}`,
//      {
//        auth: {
//          username: `${process.env.JIRA_USERNAME}`,
//          password: `${process.env.JIRA_PASSWORD}`,
//        },
//      }
//    );
//    return res.json({
//      title: data.fields.summary,
//      description: data.fields.description,
//      assignee: data.fields.assignee.name,
//      link: `https://issues.redhat.com/browse/THEEDGE-${id}`,
//    });
//  }
//  return res.status(401).json({ message: 'You are not authorized' });
//});
//
//app.post('/slack/actions', async (req, res) => {
//  console.log('it works!');
//  try {
//    const payload = JSON.parse(req.body.payload);
//    console.log('###slack request is ' + payload);
//
//    return res.send(response);
//  } catch (err) {
//    console.log(err);
//    return res.status(500).send('Something went wrong.');
//  }
//});
