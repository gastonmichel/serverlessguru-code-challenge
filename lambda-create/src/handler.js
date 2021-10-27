const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const crypto = require('crypto')

module.exports.handler = async (event, context) => {
    let body = await dynamoDB
        .put({
            TableName: process.env.TABLE_NAME,
            Item: {
                bookId: crypto.randomBytes(16).toString("hex"),
                title: event.input.title,
                author: event.input.author,
                description: event.input.description,
                updatedAt: (new Date()).toISOString()
            },
        })
        .promise()
    return true
}