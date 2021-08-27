const axios = require('axios');

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

module.exports = { getTicketById };
