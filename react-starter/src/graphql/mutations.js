import gql from 'graphql-tag';

export const createBook = gql`
mutation CreateBook ($input: BookInput!) {
    createBook(
        input: $input
    )
}
`

export const updateBook = gql`
mutation UpdateBook ($bookId: ID!, $input: BookInput!) {
    updateBook(
        bookId: $bookId,
        input: $input
    )
}
`

export const deleteBook = gql`
mutation DeleteBook ($bookId: ID!) {
    deleteBook(
        bookId: $bookId
    )
}
`