import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Moodvie_icon from "./Moodvie_icon";
import { withRouter, Redirect, Link } from "react-router-dom";
import history from "./history";
import { Button } from "@material-ui/core";
import jwt_decode from "jwt-decode";

import Dialog_bar from "./Dialog";
const styles = theme => ({
  login_profile_button: { border: "0.5px solid pink", margin: "1px" },

  root: {
    width: "100%"
  },

  backapp: {
    background: "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 180,
      "&:focus": {
        width: 270
      }
    }
  }
});

function SearchAppBar(props) {
  const { classes } = props;
  function handleSubmit(e) {
    history.push("/search/" + e.target.searchterm.value);
  }
  function logout(e) {
    localStorage.removeItem("usertoken");

    history.push("/home");
  }

  return (
    <div className={classes.root}>
      <AppBar classes={{ root: classes.backapp }} postion="relative">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            color="inherit"
            noWrap
          >
            <Moodvie_icon />
          </Typography>

          <div className={classes.grow} />

          <Button color="inherit">Welcome, {props.name}</Button>

          <form>
            <Button color="inherit" onClick={e => logout(e)} type="submit">
              Logout
            </Button>
          </form>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <form onSubmit={e => handleSubmit(e)}>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                name="searchterm"
              />
            </form>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

SearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(SearchAppBar));

/*
const textBoxStyle = {
  width: "400px"
};

const iconMargin = {
  marginLeft: "10px"
};

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      loggedIn: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem("usertoken") !== null) {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      this.setState({
        name: decoded.identity.username,
        loggedIn: true
      });
    }
  }

  logout(e) {
    e.preventDefault();
    localStorage.removeItem("usertoken");
    this.props.history.push("/");
  }

  render() {
    const loginLink = (
      <React.Fragment>
        <div className="headerContainer">
          <Moodvie_result_icon />
          <ul>
            <li>
              <Link to="users/login">Login</Link>
            </li>
            <li>
              <Link to="users/register">Register</Link>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );

    const userLink = (
      <React.Fragment>
        <div className="headerContainer">
          <div className="icon">
            <Moodvie_result_icon />
          </div>
          <div className="userLog">
            <h4>Hello, {this.state.name}</h4>
            <button
              className="btn btn-lg btn-primary btn-block"
              href=""
              onClick={this.logout.bind(this)}
            >
              LogOut
            </button>
          </div>
        </div>
      </React.Fragment>
    );
    return <div>{localStorage.usertoken ? userLink : loginLink}</div>;
  }
}

export default withRouter(Landing);
*/
