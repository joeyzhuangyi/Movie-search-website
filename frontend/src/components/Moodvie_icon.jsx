import React, { Component } from "react";

import "./css/moodvie_icon.css";

class Moodvie_icon extends Component {
  state = {};
  render() {
    return (
      <a href="/home" style={{ textDecoration: "none" }}>
        <div className="moodvie_icon">Moodvie</div>
      </a>
    );
  }
}

export default Moodvie_icon;
