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
          value: `${num}`,
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

module.exports = { createTicketInfo, createPoll };
