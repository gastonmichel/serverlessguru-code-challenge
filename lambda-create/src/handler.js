const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const crypto = require('crypto')

module.exports.handler = async (event, context) => {
    const bookId = crypto.randomBytes(16).toString("hex")
    let body = await dynamoDB
        .put({
            TableName: process.env.TABLE_NAME,
            Item: {
                bookId: bookId,
                title: event.input.title,
                author: event.input.author,
                description: event.input.description,
                updatedAt: (new Date()).toISOString()
            },
        })
        .promise()
    return bookId
}