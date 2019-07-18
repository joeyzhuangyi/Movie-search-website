import React, { Component } from "react";
import Moodvie_result_icon from "./Moodive_result_icon";
import Navbar from "./navbar";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Moodvie_icon from "./Moodvie_icon";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import { ButtonBase, Button, Zoom, Input } from "@material-ui/core";

const styles = {
  root: {
    width: "40%"
  }
};
class Watchlist extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      movies: [],
      search: ""
    };

    this.updateSearch = this.updateSearch.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.deleteMovie = this.deleteMovie.bind(this);
  }

  getUsername() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.identity.username;
  }

  deleteMovie(id) {
    let user = this.getUsername();
    console.log(id);

    const promise = axios.post(
      "http://127.0.0.1:4897/" + user + "/deletefromwatchlist",
      {
        movieID: id
      }
    );

    const newMovies = this.state.movies.filter(movie => {
      return movie.id !== id;
    });

    this.setState({
      movies: [...newMovies]
    });
  }

  async componentDidMount() {
    //Get username
    let nuser = this.getUsername();
    const promise = axios.get("http://127.0.0.1:4897/" + nuser + "/watchlist");
    const reponse = await promise;
    const data = reponse.data;
    this.setState({
      user: nuser,
      movies: data,
      search: ""
    });
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  render() {
    const { classes } = this.props;
    //Search for movies function
    console.log(this.state.movies);
    let filteredMovies = this.state.movies.filter(movie => {
      return (
        movie.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !==
        -1
      );
    });

    //Render movies
    let movieList = filteredMovies.map(movie => (
      <ListItem button key={movie.id}>
        <a href={movie.link} style={{ textDecoration: "none" }} target="_blank">
          <Typography component="h2" variant="display1">
            {movie.title}
          </Typography>
        </a>

        <IconButton
          aria-label="Delete"
          onClick={() => this.deleteMovie(movie.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    ));
    return (
      <React.Fragment>
        <Input
          type="text"
          value={this.state.search}
          placeholder="Search For movie in watchlist"
          onChange={this.updateSearch.bind(this)}
          classes={{ root: classes.root }}
        />

        {movieList}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Watchlist);

// handleChange = event => {
//   //Turn Search to lower case
//   var query = event.target.value.toLowerCase();
//   console.log(query);
//   //list of movies
//   //Turn all titles to lower case
//   console.log();
// };
