import React, { Component } from "react";
import "./css/home.css";
import TextField from "@material-ui/core/TextField";
import Dialog_bar from "./Dialog";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  Paper,
  Input,
  FormControl,
  Button,
  Grid,
  IconButton,
  Fab,
  Typography
} from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Badge from "react-bootstrap/Badge";
const styles = {
  root: {
    width: "40%",
    position: "absolute",
    top: "50%",
    left: "30%"
  },
  input: {
    height: "1.6cm",
    "font-size": "0.8cm",
    padding: "1px"
  },
  iconButton: {
    position: "absolute",
    top: "51%",
    left: "66%"
  },
  recommand: {}
};
class Home extends Component {
  state = {
    recommand: ""
  };
  search_term = React.createRef();

  async componentDidMount() {
    const { classes } = this.props;
    if (localStorage.getItem("usertoken") !== null) {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      const name = decoded.identity.username;
      const promise = axios.get("http://127.0.0.1:4897/recommend/" + name);
      const reponse = await promise;
      const data = reponse.data;
      console.log(data);

      let recommand = data.map(item => {
        return (
          <Fab variant="extended" color="primary" key={item.id} size="small">
            <a
              style={{ textDecoration: "none" }}
              target="_blank"
              href={item.link}
            >
              {item.title}
            </a>
          </Fab>
        );
      });
      this.setState({ recommand: recommand });
    }
  }

  handleSubmit = e => {
    if (e.target.searchterm == undefined) {
      this.props.history.push("/search/");
    } else {
      e.preventDefault();
      this.props.history.push("/search/" + e.target.searchterm.value);
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className="searchterm display-middle">Moodvie</div>
        <Grid>
          <form onSubmit={this.handleSubmit}>
            <Paper classes={{ root: classes.root }}>
              <Input
                fullWidth
                margin="dense"
                name="searchterm"
                classes={{ root: classes.input }}
              />
            </Paper>

            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="Search"
            >
              <SearchIcon />
            </IconButton>
          </form>
        </Grid>
        <div className="login">
          <Dialog_bar />
        </div>
        <div className="rec">{this.state.recommand}</div>
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(Home);
