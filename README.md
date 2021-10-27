# AWS AppSync API to store Book Metadata

## The Challenge

Build a Serverless Framework API with AWS AppSync which supports CRUD functionality (Create, Read, Update, Delete) *don't use mapping templates directly to DynamoDB from AppSync and use GitHub Actions CI/CD pipeline, AWS CodePipeline, or Serverless Pro CI/CD. The CI/CD should trigger a deployment based on a git push to the master branch which goes through and deploys the backend Serverless Framework API.

## The Framework

I choose Serverless Components to implement the Infrastructure As Code. It had a few challenges and hicups but is mostly stable and the project resulted well-organized and readable.

### Folder Structure

Each folder contains a Serverless Component. The database folder provides the DynamoDB book-table. The iam-role-* folders describes the lambda execution roles. There are two roles, one for read/scan the table and the other to write in the table, in order to satisfy the least-privileged principle up to the read/write degree (more granularity could be added in later stage). The lambda-* folders provides the CRUD functionality and access the book-table. The api folder describes the graphql schema and link the resolvers to each lambda function.

Every component is tied up through references using serverless component environmental variables.

## The CI/CD and the multi stage deployment

The multi stage deployment is satisfied by naming every component with a stage suffix. Therefore, multiple stages can coexist in the same AWS account and region. This is a choice made for credentials simplicity sake, but multiple accounts could be implemented in a later stage.

The CI/CD engine chosen is Github Actions, that on any commit to the branches 'main' and 'dev' deploys the entire stack with the stage name equal to the branch name. The CI/CD is executed with personal https://app.serverless.com/ access key injected via repo environment secret. 

## Endpoint and authentication

For every stage there is an endpoint that points to the graphql api:

    http://main.gastonmichel.com.ar/graphql


    http://dev.gastonmichel.com.ar/graphql

Custom domain is implemented in order to be resilient to destroy and redeploy the appsync api.

The authentication is through api key, that is implemented adding a header 'x-api-key' in the request. The api-key is provided privately and expires in 7 days.

## The CRUD functionality

### Create a book

In order to Create a book execute the mutation:

    mutation CreateBook {
        createBook(
            input: {
                author: "William Shakespeare", 
                description: "A classic", 
                title: "Romeo and Juliet"
            }
        )
    }

### Read a book

To get a book from the bookId execute the query: 

    query GetBookById {
    getBookById(bookId: "08450477fc954800cd94721203974f25") {
        updatedAt
        author
        bookId
        description
        title
    }
    }

### Update a book

To update the book data execute de mutation:

    mutation UpdateBook {
        updateBook(
            bookId: "08450477fc954800cd94721203974f25", 
            input: {
                author: "Robert Kiyosaki", 
                description: "Updated Description", 
                title: "Rich Dad Poor Dad"
            }
        )
    }

Note that every field is required since the api overwrites the bookId with the new data.

### Delete a book

To delete a book execute the mutation:

    mutation MyMutation {
        deleteBook(
            bookId: "59aa11d7a5f8df82be9498d05018b9ce"
        )
    }

### (Additional) List books

Bonus Track: To list the books in the table execute the query:

    query ListBooks {
        listBooks(limit: 2) {
            books {
                author
                bookId
                description
                title
                updatedAt
                }
            nextToken
        }
    }

The query will return a nextToken that can be passed in the next query in order to get the next 'limit' number of items:

    query ListBooksNextToken {
        listBooks(limit: 2, token: "08450477fc954800cd94721203974f25") {
            books {
                author
                bookId
                description
                title
                updatedAt
                }
            nextToken
        }
    }
    
That way the data get paginated and the scan operations are prevented from being too long.