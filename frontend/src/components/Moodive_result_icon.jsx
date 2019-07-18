import React, { Component } from "react";

import "./css/moodvie_icon.css";
import Moodvie_icon from "./Moodive_result_icon";

const textBoxStyle = {
  width: "400px"
};

class Moodvie_result_icon extends Component {
  state = {};
  render() {
    return (
      <a href="/home">
        <div className="moodvie_result_icon">Moodvie</div>
      </a>
    );
  }
}

export default Moodvie_result_icon;
