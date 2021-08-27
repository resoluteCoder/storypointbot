const SlackBot = require('slackbots');
const dotenv = require('dotenv');
const axios = require('axios');

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
bot.on('message', async (data) => {
  // check for one bot per ticket
  console.log(data);
  if (data.type !== 'message') return;
  if (data.text.includes('<@U02BSM1S2RY>')) {
    console.log('received message', data);
    const ticketInfo = await getTicketById(149);
    const params = { icon_emoji: ':robot_face:', blocks: [] };
    params.blocks.push(...createTicketInfo(ticketInfo));
    params.blocks.push(...createPoll().flat());
    bot.postMessageToChannel('test', 't', params);
  }
  if (data.bot_id === 'B02BPL9S11T') {
  }
});

const getTicketById = async (id) => {
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
    return {
      title: data.fields.summary,
      description: data.fields.description,
      assignee: data.fields.assignee.name,
      link: `https://issues.redhat.com/browse/THEEDGE-${id}`,
      storyPoint: data.fields['customfield_12310243'],
      id,
    };
  } catch (error) {
    console.log('ERROR', error);
  }
};

const createTicketInfo = ({
  title,
  description,
  assignee,
  storyPoint,
  link,
  id,
}) => [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: `:ticket: ${title}? :ticket:`,
    },
  },
  {
    type: 'context',
    elements: [
      {
        text: `*Assigned to ${assignee}* |  <${link}|THEEDGE-${id}>`,
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
      text: `${storyPoint} ${description}`,
    },
  },
  {
    type: 'divider',
  },
];

const createPoll = () => {
  const nums = [1, 2, 5, 8, 13];
  return nums.map((num) => [
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: `${num}`,
            emoji: true,
          },
          value: `story_point_${num}`,
          action_id: `actionId-${num}`,
        },
      ],
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: 'No votes',
        },
      ],
    },
  ]);
};

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
