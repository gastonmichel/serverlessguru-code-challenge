import boto3
import os
import datetime as dt
import uuid

table = boto3.resource('dynamodb').Table(
   os.environ['TABLE_NAME']
)


def putBook(bookId,title,author, description=''):
    item = table.put_item(Item={
            'bookId': bookId,
            'title': title,
            'author': author,
            'descrription': description,
            'updatedAt': dt.datetime.now().isoformat()
        })
    return item

def getBookById(event, context):
    item = table.get_item(
        Key={
            'bookId': event['bookId']
        }
    )
    return item['Item']

def listBooks(event, context):
    response = table.scan()
    return response['Items']

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
    return putBook(
        bookId=event['bookId'],
        title=event['input']['title'],
        author=event['input']['author'],
        description=event['input'].get('description',''),
    )
