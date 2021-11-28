import React, { Component } from 'react';

import { Card, CardContent, CardHeader, Container, Item, ButtonGroup, Fab, Typography, Button, TextField, Paper, AppBar, Toolbar, IconButton, Stack, Grid } from '@material-ui/core';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow } from '@material-ui/core';


import AddIcon from '@mui/icons-material/Add';


import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";

function BookDialog(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle id="alert-dialog-title">
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.subtitle}
        </DialogContentText>
        <TextField
          variant="outlined"
          label='Author'
          name='author'
          onChange={props.onChange}
          fullWidth
          autoFocus
          defaultValue={props.bookInput.author}
          margin="normal"
        />
        <TextField
          variant="outlined"
          label='Title'
          name='title'
          onChange={props.onChange}
          fullWidth
          defaultValue={props.bookInput.title}
          margin="normal"
        />

        <TextField
          variant="outlined"
          label="Description"
          name='description'
          onChange={props.onChange}
          fullWidth
          multiline
          defaultValue={props.bookInput.description}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} >Cancel</Button>
        <Button onClick={props.onSubmit} autoFocus startIcon={props.icon} variant="contained" color="primary">{props.button}</Button>
      </DialogActions>
    </Dialog>
  )
}

function BookDetailDialog(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle id="alert-dialog-title">
        Book Details
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Full details on book:
        </DialogContentText>
        <TextField
          variant="outlined"
          label='Book Id'
          fullWidth
          autoFocus
          margin="normal"
          readOnly
          value={props.book.bookId}
        />
        <TextField
          variant="outlined"
          label='Author'
          fullWidth
          autoFocus
          margin="normal"
          readOnly
          value={props.book.author}
        />
        <TextField
          variant="outlined"
          label='Title'
          fullWidth
          margin="normal"
          readOnly
          value={props.book.title}
        />

        <TextField
          variant="outlined"
          label='Updated at'
          fullWidth
          margin="normal"
          readOnly
          value={props.book.updatedAt}
        />


        <TextField
          variant="outlined"
          label="Description"
          fullWidth
          multiline
          readOnly
          margin="normal"
          value={props.book.description}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} >Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.loading = false;

    this.state.selectedBook = {};
    this.state.createDialog = false;
    this.state.readDialog = false;
    this.state.editDialog = false;
    this.state.deleteDialog = false;

    this.state.inputBook = {}

    this.state.books = []
  }

  async listBooks() {
    const { data } = await API.graphql(graphqlOperation(queries.listBooks))
    this.setState({ books: data.listBooks.books })
  }

  async createBook() {
    this.handleCreateDialogClose()
    const { data } = await API.graphql(graphqlOperation(mutations.createBook, { input: this.state.inputBook }))
    this.listBooks()
  }

  async updateBook() {
    this.handleEditDialogClose()
    const { data } = await API.graphql(graphqlOperation(mutations.updateBook, { bookId: this.state.selectedBook.bookId, input: this.state.inputBook }))
    this.listBooks()
  }

  async deleteBook() {
    const { data } = await API.graphql(graphqlOperation(mutations.deleteBook, { bookId: this.state.selectedBook.bookId }))
    this.listBooks()
    this.handleDeleteDialogClose()
  }


  componentDidMount() {
    this.listBooks()
  }

  handleDeleteDialogOpen(book) {
    this.setState({ deleteDialog: true, selectedBook: book })
  };

  handleDeleteDialogClose() {
    this.setState({ deleteDialog: false })
  };

  handleEditDialogOpen(book) {
    this.setState({
      editDialog: true, selectedBook: book, inputBook: {
        title: book.title,
        author: book.author,
        description: book.description
      }
    })
  };

  handleEditDialogClose() {
    this.setState({ editDialog: false })
  };

  async handleReadDialogOpen(book) {
    const { data } = await API.graphql(graphqlOperation(queries.getBookById, { bookId: book.bookId }))
    this.setState({ readDialog: true, selectedBook: data.getBookById })
  };

  handleReadDialogClose() {
    this.setState({ readDialog: false })
  };

  handleCreateDialogOpen() {
    this.setState({ createDialog: true })
  };

  handleCreateDialogClose() {
    this.setState({ createDialog: false })
  };

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      inputBook: {
        ...this.state.inputBook,
        [name]: value
      }
    })
  }


  /**
   * Render()
   */

  render() {
    return (
      <div>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>

            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  CRUD Dashboard with GraphQL
                </Typography>
              </Toolbar>
            </AppBar>

          </Grid>
          <Grid item xs={8} >
            <Card>
              <CardHeader
                title="Book Table"
                subheader="Here you can store your books"
                style={{
                  margin: 20,
                }}
              />
              <CardContent>
                <Paper>
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell><Typography variant='h6'>Author</Typography></TableCell>
                          <TableCell><Typography variant='h6'>Title</Typography></TableCell>
                          <TableCell><Typography variant='h6'>Description</Typography></TableCell>
                          <TableCell><Typography variant='h6'>Actions</Typography></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {this.state.books.map(book => (
                          <TableRow key={book.bookId}>
                            <TableCell>{book.author}</TableCell>
                            <TableCell>{book.title}</TableCell>
                            <TableCell>{book.description}</TableCell>
                            <TableCell>
                              <ButtonGroup variant="contained" color='default'>
                                <Button onClick={() => this.handleReadDialogOpen(book)}><RemoveRedEyeIcon /></Button>
                                <Button onClick={() => this.handleEditDialogOpen(book)}><ModeEditIcon /></Button>
                                <Button onClick={() => this.handleDeleteDialogOpen(book)}><DeleteOutlineIcon /></Button>
                              </ButtonGroup>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
          </Grid>
        </Grid>
        <Fab color="primary"
          aria-label="add"
          onClick={() => this.handleCreateDialogOpen()}
          style={{
            margin: 0,
            top: 'auto',
            right: 40,
            bottom: 40,
            left: 'auto',
            position: 'fixed',
          }}>
          <AddIcon />
        </Fab>
        <Dialog
          open={this.state.deleteDialog}
          onClose={() => this.handleDeleteDialogClose()}
        >
          <DialogTitle id="alert-dialog-title">
            Confirm delete book
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this book?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDeleteDialogClose()} autoFocus>Cancel</Button>
            <Button onClick={() => this.deleteBook()} variant="outlined" startIcon={<DeleteOutlineIcon />} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>

        <BookDialog
          open={this.state.editDialog}
          onClose={() => this.handleEditDialogClose()}
          onChange={(event) => this.handleInputChange(event)}
          onSubmit={() => this.updateBook()}
          title="Edit Book"
          subtitle="Edit the book data"
          icon={<ModeEditIcon />}
          bookInput={this.state.inputBook}
          button="EDIT"
        />

        <BookDialog
          open={this.state.createDialog}
          onClose={() => this.handleCreateDialogClose()}
          onChange={(event) => this.handleInputChange(event)}
          onSubmit={() => this.createBook()}
          title="Create Book"
          subtitle="Fill the new book data"
          icon={<AddIcon />}
          button="CREATE"
          bookInput={{}}
        />
        <BookDetailDialog
          open={this.state.readDialog}
          onClose={() => this.handleReadDialogClose()}
          book={this.state.selectedBook}
        />


      </div>
    );
  }
}
