import gql from 'graphql-tag';

export const getBookById = gql`
query GetBookById ($bookId: ID!) {
    getBookById(bookId: $bookId) {
        updatedAt
        author
        bookId
        description
        title
    }
}
`
export const listBooks = gql`
query ListBooks {
    listBooks(limit: 10) {
        books {
            author
            bookId
            description
            title
            }
    }
}
`