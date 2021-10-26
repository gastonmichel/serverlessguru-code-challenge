const AWS = require("aws-sdk") 
const dynamoDB = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event, context) => {
    let body = await dynamoDB
        .delete({
            TableName: process.env.TABLE_NAME,
            Key: {
                bookId: event.bookId,
            },
        })
        .promise()
    return true
}