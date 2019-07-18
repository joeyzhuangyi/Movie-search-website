import React, { Component } from "react";
import Moodvie_result_icon from "./Moodive_result_icon";
import axios from "axios";
import userImage from "../assets/user.jpg";
import jwt_decode from "jwt-decode";
import Navbar from "./navbar";
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
import Watchlist from "./Watchlist";
const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  },
  IconButt: {
    top: "25px"
  }
});

class UserProfile extends Component {
  // TODO: Save image in user state
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      movies: [],
      mobileOpen: false,
      open: false,
      body: "",
      isNameButtonDisabled: false,
      isEmailButtonDisabled: false,
      search: "",
      movieList: ""
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.deleteMovie = this.deleteMovie.bind(this);
  }

  async componentDidMount() {
    if (localStorage.getItem("usertoken") !== null) {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      const defaultBody = (
        <React.Fragment>
          <Typography variant="display2" style={{ paddingTop: "4px" }}>
            Welcome!
          </Typography>
          <Typography variant="h5" style={{ paddingTop: "4px" }}>
            Name:
            {decoded.identity.username}
          </Typography>
          <Typography variant="h5" style={{ paddingTop: "4px" }}>
            Email: {decoded.identity.email}
          </Typography>

          <Typography variant="display1" style={{ paddingTop: "4px" }}>
            This is where your journey start...
          </Typography>
        </React.Fragment>
      );
      console.log(decoded.identity.username);
      this.setState({
        name: decoded.identity.username,
        email: decoded.identity.email,

        body: defaultBody
      });

      console.log(this.state.name);

      let nuser = decoded.identity.username;
      const promise = axios.get(
        "http://127.0.0.1:4897/" + nuser + "/watchlist"
      );
      const reponse = await promise;
      const data = reponse.data;
      console.log(data);
      this.setState({
        movies: data
      });
    } else {
      this.props.history.push("/home");
    }
  }

  ChangeToProfile = () => {
    console.log(this);

    const defaultBody = (
      <Zoom in>
        <Grid>
          <React.Fragment>
            <Typography variant="display2" style={{ paddingTop: "4px" }}>
              Welcome!
            </Typography>
            <Typography variant="h5" style={{ paddingTop: "4px" }}>
              Name:
              {this.state.name}
            </Typography>
            <Typography variant="h5" style={{ paddingTop: "4px" }}>
              Email: {this.state.email}
            </Typography>

            <Typography variant="display1" style={{ paddingTop: "4px" }}>
              This is where your journey start...
            </Typography>
          </React.Fragment>
        </Grid>
      </Zoom>
    );

    this.setState({
      body: defaultBody
    });
  };

  //Change Name
  changeName = event => {
    //prevent re-render
    event.preventDefault();
    //Grab newName from the form
    let newName = event.target.name.value;
    if (newName === "") {
      return;
    } else {
      //1. Changae name in backend
      const promise = axios
        .post("http://127.0.0.1:4897/profile", {
          oldUsername: this.state.name,
          newUsername: newName,
          oldEmail: this.state.email,
          newEmail: this.state.email
        })
        .then(res => {
          localStorage.clear("usertoken");
          localStorage.setItem("usertoken", res.data.token);
          console.log(res);
        });
      //2. Change name in frontend
      this.setState({
        name: newName,
        isNameButtonDisabled: true
      });
      //3. Change name in localStorage
    }
  };

  changeEmail = event => {
    //prevent re-render
    event.preventDefault();
    console.log(event.target.email.value);
    //Grab newEmail from the form

    let newEmail = event.target.email.value;
    if (newEmail === "") {
      return;
    } else {
      //Pass in newName to backend
      const promise = axios
        .post("http://127.0.0.1:4897/profile", {
          oldUsername: this.state.name,
          newUsername: this.state.name,
          oldEmail: this.state.email,
          newEmail: newEmail
        })
        .then(res => {
          localStorage.clear("usertoken");
          localStorage.setItem("usertoken", res.data.token);
          console.log(res);
        });
      console.log(newEmail);
      console.log(this.state.email);

      this.setState({
        email: newEmail,
        isEmailButtonDisabled: true
      });
    }
  };

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  getUsername() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    return decoded.identity.username;
  }
  ChangetowatchList = () => {
    //Render movies

    this.setState({
      body: (
        <Zoom>
          <Watchlist />
        </Zoom>
      )
    });
  };

  deleteMovie(id) {
    let user = this.getUsername();
    console.log(id);

    axios.post("http://127.0.0.1:4897/" + user + "/deletefromwatchlist", {
      movieID: id
    });

    const newMovies = this.state.movies.filter(movie => {
      return movie.id !== id;
    });

    const newList = newMovies.map(movie => (
      <ListItem button key={movie.title}>
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

    this.setState({
      movies: [...newMovies],
      body: <h1>{newList}</h1>
    });
  }

  ChangetoFollowing = () => {
    const { classes, theme } = this.props;
    const newBody = (
      <Typography component="h2" variant="display1">
        Moodving... Coming Soon!
      </Typography>
    );

    this.setState({
      body: newBody
    });
  };

  ChangeToChangeProfile = () => {
    const { classes, theme } = this.props;
    const newBody = (
      <Zoom in>
        <Grid>
          <React.Fragment>
            <form onSubmit={this.changeName}>
              <TextField
                label="Name"
                defaultValue={this.state.name}
                margin="normal"
                inputProps={{ name: "name" }}
              />
              <IconButton classes={{ root: classes.IconButt }} type="submit">
                <SaveIcon />
              </IconButton>
            </form>
            <form onSubmit={this.changeEmail}>
              <TextField
                label="Email"
                defaultValue={this.state.email}
                margin="normal"
                inputProps={{ name: "email" }}
              />
              <IconButton classes={{ root: classes.IconButt }} type="submit">
                <SaveIcon />
              </IconButton>
            </form>
            <form onSubmit={this.changeName.bind(this)}>
              <TextField
                label="Password"
                defaultValue={"*****"}
                margin="normal"
                inputProps={{ name: "pw" }}
              />
              <IconButton classes={{ root: classes.IconButt }}>
                <SaveIcon />
              </IconButton>
            </form>
          </React.Fragment>
        </Grid>
      </Zoom>
    );
    this.setState({
      body: newBody
    });
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };
  render() {
    const { classes, theme } = this.props;
    const { open } = this.state.open;

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <div style={{ padding: "10px", paddingLeft: "40px" }}>
            <Moodvie_icon />
          </div>
        </div>

        <Divider />
        <List>
          <ListItem button onClick={this.ChangeToProfile}>
            <ListItemText primary="My profile" />
          </ListItem>
          <ListItem button onClick={this.ChangeToChangeProfile}>
            <ListItemText primary="Change profile" />
          </ListItem>

          <ListItem button onClick={this.ChangetowatchList}>
            <ListItemText primary="My Watch List" />
          </ListItem>
          <ListItem button onClick={this.ChangetoFollowing}>
            <ListItemText primary="My Following" />
          </ListItem>
        </List>
      </div>
    );

    return (
      <React.Fragment>
        <Grid container>
          <Paper
            style={{
              padding: 40,
              marginTop: 40,
              marginBottom: 10,
              height: "30cm",
              width: "100%"
            }}
          >
            <nav className={classes.drawer}>
              <Hidden xsDown implementation="css">
                <Drawer
                  classes={{
                    paper: classes.drawerPaper
                  }}
                  variant="permanent"
                  open={open}
                >
                  {drawer}
                </Drawer>
              </Hidden>
            </nav>

            <Navbar name={this.state.name} />

            <div style={{ paddingLeft: "20%" }}>{this.state.body}</div>
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(UserProfile);
