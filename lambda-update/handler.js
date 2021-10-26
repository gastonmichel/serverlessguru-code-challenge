const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event, context) => {
    let body = await dynamoDB
        .put({
            TableName: process.env.TABLE_NAME,
            Item: {
                bookId: event.bookId,
                title: event.input.title,
                author: event.input.author,
                description: event.input.description,
                updatedAt: (new Date()).toISOString()
            },
        })
        .promise()
    return true
    
}