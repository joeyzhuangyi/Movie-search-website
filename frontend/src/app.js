import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Home from "./components/Home";
import MovieResult from "./components/MovieResult";
import MovieDetails from "./components/MovieDetails";
import UserProfile from "./components/UserProfile";
import Watchlist from "./components/Watchlist";
import ChangeProfile from "./components/ChangeProfile";
import Register from "./components/Register";
import Login from "./components/Login";
import { withRouter } from "react-router";
import SearchAppBar from "./components/NavBarTop.jsx";
import NotFound from "./components/NotFound";
import Test from "./components/test.jsx";
class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/home" component={Home} />
          <Redirect from="/search" exact to="/home" />
          <Route path="/search/:term" component={MovieResult} />
          <Route path="/moviedetails/:id" component={MovieDetails} />
          <Route path="/user" component={UserProfile} />
          <Route path="/watchlist" component={Watchlist} />
          <Route path="/users/register" component={Register} />
          <Route path="/users/login" component={Login} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/test" component={Test} />
          <Redirect to="/not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
