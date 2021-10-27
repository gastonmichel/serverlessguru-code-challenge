const AWS = require("aws-sdk")
const dynamoDB = new AWS.DynamoDB.DocumentClient()

module.exports.handler = async (event, context) => {
    let payload = {
        TableName: process.env.TABLE_NAME,
        Limit: 10
    }
    if ('token' in event){
        payload.ExclusiveStartKey = {
            bookId: event.token
        }
    }
    if ('limit' in event){
        payload.Limit = event.limit
    }
    let body = await dynamoDB
        .scan(payload)
        .promise()
    console.log(body)
    let response = {}
    if ('LastEvaluatedKey' in body){
        response.nextToken = body.LastEvaluatedKey.bookId
    }
    else{
        response.nextToken = null
    }
    response.books = body.Items
    return response
}