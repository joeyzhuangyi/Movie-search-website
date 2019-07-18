import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withRouter, Redirect, Link } from "react-router-dom";
import history from "./history";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import jwt_decode from "jwt-decode";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import { login } from "./UserFunctions";
import "./css/home.css";

const styles = {
  login_profile_button: {
    border: "0.5px solid pink",
    margin: "4px",
    "text-decoration": "none",
    font: "white"
  }
};
class Dialog_bar extends Component {
  constructor() {
    super();
    this.state = {
      name: undefined,
      login: false,
      openLogin: false,
      openSignup: false,
      openProfile: false
    };
  }
  DidMount() {}
  handleLogin = e => {
    e.preventDefault();
    console.log(e.target.name.value);
    console.log(e.target.pw.value);
    const user = {
      username: e.target.name.value,
      password: e.target.pw.value
    };


    if (localStorage.getItem("usertoken") !== null) {
      localStorage.removeItem("usertoken");
    }

    login(user).then(res => {
      console.log(res);
      if (res.data.result === "success") {
        localStorage.setItem("usertoken", res.data.token);
        this.props.history.push("/user");
      }
    });
    this.setState({ openLogin: false, login: true });
  };
  handleLoginOpen = () => {
    this.setState({ openLogin: true });
  };
  handleLoginClose = () => {
    this.setState({ openLogin: false });
  };

  render() {
    const { classes } = this.props;
    let re;
    console.log(localStorage.usertoken);
    if (localStorage.getItem("usertoken") !== null) {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);

      console.log(decoded);
      re = (
        <React.Fragment>
          <Button
            size="medium"
            color="inherit"
            classes={{ root: classes.login_profile_button }}
          >
            <a
              target="_blank"
              href="http://localhost:3000/profile"
              style={{ textDecoration: "none" }}
            >
              Profile
            </a>
          </Button>
        </React.Fragment>
      );
    } else {
      re = (
        <React.Fragment>
          <Button
            color="inherit"
            size="medium"
            classes={{ root: classes.login_profile_button }}
            onClick={this.handleLoginOpen}
          >
            Login?
          </Button>
          <Dialog
            open={this.state.openLogin}
            onClose={this.handleLoginClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Login</DialogTitle>
            <form onSubmit={this.handleLogin}>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  name="name"
                  label="User Name"
                  type="Text"
                  fullWidth
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="pw"
                  name="pw"
                  label="Password"
                  type="Password"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button type="submit" color="primary" size="medium">
                  Login
                </Button>
                <Button
                  onClick={this.handleLoginClose}
                  color="primary"
                  size="medium"
                >
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Button
            color="inherit"
            classes={{ root: classes.login_profile_button }}
            size="medium"
          >
            <a
              href="http://localhost:3000/users/register"
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              Sign Up!
            </a>
          </Button>
        </React.Fragment>
      );
    }
    return re;
  }
}

export default withRouter(withStyles(styles)(Dialog_bar));

/*


if (localStorage.getItem("usertoken") !== null) {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      re = (
        <React.Fragment>
          <Button
            color="inherit"
            classes={{ root: classes.login_profile_button }}
          >
            <a
              href="http://localhost:3000/profile"
              style={{ textDecoration: "none" }}
            >
              Profile
            </a>
          </Button>
        </React.Fragment>
      );
    } else {
      re = (
        <React.Fragment>
          <Button
            color="inherit"
            classes={{ root: classes.login_profile_button }}
          >
            Login?
          </Button>
          <Dialog
            open={this}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To subscribe to this website, please enter your email address
                here. We will send updates occasionally.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleClose} color="primary">
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            color="inherit"
            classes={{ root: classes.login_profile_button }}
          >
            Signup!
          </Button>
        </React.Fragment>
      );
    }


*/
