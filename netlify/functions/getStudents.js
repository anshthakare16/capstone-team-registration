const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

exports.handler = async (event) => {
  const classParam = event.queryStringParameters.class;
  if (!classParam) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Class parameter missing' }),
    };
  }

  let fileName = '';
  switch (classParam.toLowerCase()) {
    case 'aids':
      fileName = 'aids_students.csv';
      break;
    case 'cse a':
    case 'csea':
      fileName = 'csa_a_students.csv';
      break;
    case 'cse b':
    case 'cseb':
      fileName = 'cse_b_students.csv';
      break;
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid class' }),
      };
  }

  // ✅ Use absolute root path instead of __dirname
  const filePath = path.join(process.cwd(), 'data', fileName);

  return new Promise((resolve) => {
    const students = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const student = row["Name of the Student"]?.trim();
        if (student) students.push(student);
      })
      .on('end', () => {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ students }),
        });
      })
      .on('error', (err) => {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to read file', details: err.message }),
        });
      });
  });
};
