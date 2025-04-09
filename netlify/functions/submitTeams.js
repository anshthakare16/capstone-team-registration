const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { class: selectedClass, members, mentors, ideas } = data;

    if (!selectedClass || !members?.[0] || !ideas?.[0]) {
      return {
        statusCode: 400,
        body: 'Missing required fields',
      };
    }

    const row = [
      selectedClass,
      ...members,
      ...mentors,
      ...ideas
    ];

    const filePath = path.join(__dirname, '../../data/teams.csv');
    const exists = fs.existsSync(filePath);

    if (!exists) {
      const header = 'Class,Member1,Member2,Member3,Member4,Mentor1,Mentor2,Mentor3,Mentor4,Idea1,Idea2,Idea3\n';
      fs.writeFileSync(filePath, header);
    }

    fs.appendFileSync(filePath, row.join(',') + '\n');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Team submitted successfully!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save data', details: err.message }),
    };
  }
};
