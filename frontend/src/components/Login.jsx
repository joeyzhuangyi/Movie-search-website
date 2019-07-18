import React, { Component } from "react";
import { login } from "./UserFunctions";
import { Link, withRouter } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    login(user).then(res => {
      localStorage.setItem("usertoken", res.data.token);
      console.log(res);
      if (res.data.result === "success") {
        this.props.history.push("/user");
      }
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please Login</h1>
              {/* <div className="form-group"> */}
              <label htmlFor="Username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={this.state.username}
                onChange={this.onChange}
              />
              {/* </div> */}
              {/* <div className="form-group"> */}
              <label htmlFor="Password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.onChange}
              />
              {/* </div> */}
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Login
              </button>

              <Link to="/users/register">Sign Up!</Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
