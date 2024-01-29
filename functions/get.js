const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.obtenerPeopleHandler = async () => {
    try {
      const data = await db.scan({
        TableName: process.env.PEOPLE_TABLE,
      }).promise();
  
      return { statusCode: 200, body: JSON.stringify(data.Items) };
    } catch (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
};

exports.obtenerPeopleIdHandler = async (event) => {
    try {
      const { id } = event.pathParameters;
  
      const data = await db.get({
        TableName: process.env.PEOPLE_TABLE,
        Key: { id },
      }).promise();
  
      return { statusCode: 200, body: JSON.stringify(data.Item) };
    } catch (error) {
      console.error(error);
      return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }
  };