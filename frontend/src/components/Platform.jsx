import React, { Component } from "react";
import axios from "axios";
import SpinnerPage from "./Spinner";
import not_available from "./icon/not_available.png";
import "./css/platform.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Grow,
  Typography,
  Zoom,
  Icon,
  Button,
  Tooltip,
  Fab,
  Fade,
  CardMedia
} from "@material-ui/core";
class Platform extends Component {
  state = {
    loading_link: this.props.loading_link,
    name: this.props.name,
    platform_block: <CircularProgress />,
    icon_root: "none",
    id: this.props.id
  };

  not_available() {
    return (
      <Button variant="contained" disabled>
        {this.state.name + "-:(  Not available"}
      </Button>
    );
  }
  color_button() {
    let ran = Math.floor(Math.random() * Math.floor(3));
    let prim = "";
    switch (ran) {
      case 0:
        prim = "primary";
        break;
      case 1:
        prim = "secondary";
        break;
      default:
        prim = "inherit";
        break;
    }
    return prim;
  }
  available(price, link) {
    return (
      <a target="_blank" href={link} style={{ textDecoration: "none" }}>
        <Button variant="contained" color={this.color_button()}>
          {this.state.name + "-" + price}
        </Button>
      </a>
    );
  }
  async componentDidMount() {
    console.log(this.state.loading_link);

    const promise = axios.get(this.state.loading_link);

    const reponse = await promise;
    const data = reponse.data;
    //TODO: Push price data to backend
    axios
      .post("http://127.0.0.1:4897/result_id=" + this.state.id, {
        name: this.state.name,
        price: data.price
      })
      .then(res => {});
    //console.log(platform);

    if (data.link == "N/A") {
      this.setState({
        platform_block: this.not_available()
      });
    } else {
      this.setState({
        platform_block: this.available(data.price, data.link)
      });
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="PlatformBlock">{this.state.platform_block}</div>
      </React.Fragment>
    );
  }
}

export default Platform;
