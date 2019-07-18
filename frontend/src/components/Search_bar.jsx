import React, { Component } from "react";

class Search_bar extends Component {
  state = {
    text: this.props.bar_text
  };
  search_term = React.createRef();
  handleSubmit = e => {
    e.preventDefault();
    const x = this.props.pushFunction;
    x("/search/" + e.target.searchterm.value);
  };
  render() {
    return (
      <React.Fragment>
        <div>
          <div className="form-group">
            <label htmlFor="searchterm">Moodvie</label>
            <form onSubmit={this.handleSubmit}>
              <input
                id="searchterm"
                ref={this.search_term}
                type="text"
                className="form-control"
                name="searchterm"
                placeholder="what do you want to watch today?"
              />
              <button className="btn btn-danger">Search</button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Search_bar;
