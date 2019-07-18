import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/badge.css";
import "./css/src.css";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";

const styles = {
  poster: {
    "margin-left": "auto",
    "margin-right": "auto",
    width: "100%",
    height: "310px",
    "object-fit": "fill"
  },
  root: {
    width: "20%",

    height: "360px",
    float: "left",
    "margin-left": "3%",
    "margin-bottom": "3%",
    display: "inline-block"
  }
};
class MovieBlock extends Component {
  state = {
    id: this.props.title + this.props.date,
    title: this.props.title,
    imageUrl: this.props.imageUrl,
    date: this.props.date,
    currnt: 2020,

    movie_page: "/moviedetails/" + this.props.id
  };

  title_color() {
    if (this.state.date < this.state.currnt) return "alert alert-dark";
    return "alert alert-warning";
  }

  availalble() {
    if (this.state.date < this.state.currnt) return "available";
    return "upcoming";
  }
  GoMoviePage() {}

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <a href={this.state.movie_page} style={{ textDecoration: "none" }}>
          <Card classes={{ root: classes.root }}>
            <CardActionArea>
              <CardMedia
                component="img"
                image={this.state.imageUrl}
                classes={{ root: classes.poster }}
              />
            </CardActionArea>
            <CardActions>
              <Typography>
                {this.state.title}({this.state.date})
              </Typography>
            </CardActions>
          </Card>
        </a>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MovieBlock);
