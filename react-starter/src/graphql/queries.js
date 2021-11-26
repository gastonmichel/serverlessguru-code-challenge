export const getBookById = `query GetBookById {
    getBookById(bookId: $bookId) {
        updatedAt
        author
        bookId
        description
        title
    }
}
`
export const listBooks = `query ListBooks {
    listBooks(limit: 10) {
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
`