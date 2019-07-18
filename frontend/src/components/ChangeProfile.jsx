import React, { Component } from "react";
import Moodvie_result_icon from "./Moodive_result_icon";
import "../components/css/userProfile.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Navbar from "./navbar";

class ChangeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      movies: ["H"],
      isNameButtonDisabled: false,
      isEmailButtonDisabled: false
    };
  }

  componentDidMount() {
    if (localStorage.getItem("usertoken") !== null) {
      const token = localStorage.usertoken;
      const decoded = jwt_decode(token);
      this.setState({
        name: decoded.identity.username,
        email: decoded.identity.email,
        movies: decoded.identity.movies
      });
    } else {
      this.props.history.push("/users/login");
    }
  }

  //Change Name
  changeName(event) {
    //prevent re-render
    event.preventDefault();
    //Grab newName from the form
    let newName = this.refs.name.value;
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
          localStorage.clear();
          localStorage.setItem("usertoken", res.data.token);
          console.log(res);
        });
      //2. Change name in frontend
      this.setState({
        name: newName,
        isNameButtonDisabled: true
      });
      this.refs.name.value = "";

      //3. Change name in localStorage
    }
  }

  changeEmail(event) {
    //prevent re-render
    event.preventDefault();
    //Grab newEmail from the form
    let newEmail = this.refs.email.value;
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
          localStorage.clear();
          localStorage.setItem("usertoken", res.data.token);
          console.log(res);
        });
      console.log(newEmail);
      console.log(this.state.email);
      this.refs.email.value = "";
      this.setState({
        email: newEmail,
        isEmailButtonDisabled: true
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* Include navbar component */}
        <div className="headerContainer">
          <Navbar />
        </div>

        {/* User Profile */}
        <div className="bottom">
          <div className="navigation">
            <h2>Navigation</h2>
            <br />
            <p>
              <a href="/user"> Your User Page </a>
            </p>
            <p>
              <a href="/watchlist">Your Watchlist</a>
            </p>
          </div>
          <div className="profile">
            <h2 className="welcome">
              <b>Account Settings</b>
            </h2>
            <div className="details">
              <span className="detailField">
                <b>Name:</b>
              </span>
              {this.state.name} <br />
              <span className="detailField">
                <b>Email:</b>
              </span>
              {this.state.email} <br />
              <span className="detailField">
                <b>Change Name:</b>
              </span>
              <form onSubmit={this.changeName.bind(this)}>
                <div>
                  <input type="text" ref="name" placeholder="Enter new name" />
                  <div className="searchbtn">
                    <button disabled={this.state.isNameButtonDisabled}>
                      Change
                    </button>
                  </div>
                </div>
              </form>
              <br />
              <span className="detailField">
                <b>Change email:</b>
              </span>
              <form onSubmit={this.changeEmail.bind(this)}>
                <div>
                  <input
                    ref="email"
                    type="text"
                    placeholder="Enter new email"
                  />
                  <div className="searchbtn">
                    <button disabled={this.state.isEmailButtonDisabled}>
                      Change
                    </button>
                  </div>
                </div>
              </form>
              <br />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ChangeProfile;
