import boto3
import os
import datetime as dt
import uuid

table = boto3.resource('dynamodb').Table(
   os.environ['TABLE_NAME']
)


def getBookById(event, context):
    item = table.get_item(
        Key={
            'bookId': event['bookId']
        }
    )
    return item['Item']

def listBooks(event, context):
    pass

def createBook(event, context):
    return putBook(
        bookId=str(uuid.uuid1()),
        title=event['input']['title'],
        author=event['input']['author'],
        description=event['input'].get('description',''),
    )

def deleteBook(event, context):
    table.delete_item(
        Key={
            'bookId': event['bookId']
        }
    )
    return True

def updateBook(event, context):
    expressionAttributeValues = {
            ':t': {'S': event['input']['title']},
            ':a': {'S': event['input']['author']},
            ':d': {'S': ''},
            ':u': {'S': dt.datetime.now().isoformat()},
        }
    if 'description' in event['input']:
        expressionAttributeValues[':d'] = {'S': event['input']['description']}
    item = table.update_item(
        ExpressionAttributeNames={
            '#T': 'title',
            '#A': 'author',
            '#D': 'description',
            '#U': 'updatedAt'
        },
        ExpressionAttributeValues=expressionAttributeValues,
        Key={
            'bookId': {
                'S': event['bookId'],
            }
        },
        ReturnValues='ALL_NEW',
        UpdateExpression='SET #T = :t, #A = :a, #D = :d, #U = :u',
    )
    return item

def putBook(bookId,title,author, description=''):
    item = {
            'bookId': bookId,
            'title': title,
            'author': author,
            'descrription': description,
            'updatedAt': dt.datetime.now().isoformat()
        }
    item = table.put_item(Item=item)
    return item
