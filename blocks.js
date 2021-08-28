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

const createPoll = (scores) => {
  return scores.map((num) => [
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: `${num.name}`,
            emoji: true,
          },
          value: `${num.name}`,
          action_id: `actionId-${num.name}`,
        },
      ],
    },
    {
      type: 'context',
      block_id: num.name,
      elements: [
        {
          type: 'mrkdwn',
          text: `${num.score} votes`,
        },
      ],
    },
  ]);
};

module.exports = { createTicketInfo, createPoll };
