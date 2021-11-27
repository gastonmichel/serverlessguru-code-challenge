import React, { Component } from 'react';
import imageHero from './images/hero.png';

import { Card, CardContent, CardHeader, Container, Item, ButtonGroup, Fab, Typography, Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField, Paper, AppBar, Toolbar, IconButton, Stack, Grid } from '@material-ui/core';

import AddIcon from '@mui/icons-material/Add';


import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import gql from 'graphql-tag';
Amplify.configure(awsconfig);

import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.loading = false;
    this.state.votes = 0;
    this.saveVote = this.saveVote.bind(this);

    this.state.selectedRow = {};
    this.state.createDialog = false;
    this.state.readDialog = false;
    this.state.editDialog = false;
    this.state.deleteDialog = false;

    this.state.books = []
  }

  async componentDidMount() {
    const { data } = await API.graphql(graphqlOperation(queries.listBooks))
    this.setState({ books: data.listBooks.books })
  }

  async saveVote() {
    this.setState({ votes: this.state.votes + 1 });
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
                  margin: 30,
                }}
              />
              <CardContent>
                <Container>
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
                              <ButtonGroup variant="contained" color='secondary'>
                                <Button><RemoveRedEyeIcon /></Button>
                                <Button><ModeEditIcon /></Button>
                                <Button><DeleteOutlineIcon /></Button>
                              </ButtonGroup>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Container>
              </CardContent>
            </Card>
          </Grid>
          <Grid>
          </Grid>
        </Grid>
        <Fab color="primary" aria-label="add" style={{
          margin: 0,
          top: 'auto',
          right: 40,
          bottom: 40,
          left: 'auto',
          position: 'fixed',
        }}>
          <AddIcon />
        </Fab>
      </div>
    );
  }
}
