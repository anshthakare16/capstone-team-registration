const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const filePath = path.join(__dirname, '../../data/teams.csv');

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      statusCode: 200,
      body: content,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="teams.csv"'
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read file', details: err.message })
    };
  }
};