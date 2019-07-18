import React, { Component } from "react";
import axios from "axios";
import Platform from "./Platform";
import CircularProgress from "@material-ui/core/CircularProgress";
import jwt_decode from "jwt-decode";
import "./css/movie_detail.css";
import "./css/badge.css";
import "./css/button.css";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SearchAppBar from "./NavBarTop";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  EmailShareButton
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  GooglePlusIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  RedditIcon,
  TumblrIcon,
  LivejournalIcon,
  MailruIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  EmailIcon
} from "react-share";
import {
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount
} from "react-share";
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
import IconButton from "@material-ui/core/IconButton";
import Badge_b from "react-bootstrap/Badge";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Watchlist from "./Watchlist";

const styles = {
  cast_button: {
    margin: "3px",
    font: "white"
  },
  summary: {
    width: "50%"
  },

  poster: {
    "margin-left": "auto",
    "margin-right": "auto",
    width: "70%",
    height: "auto",
    "object-fit": "fill"
  },
  thumb: {
    marginLeft: "10px"
  }
};

class MovieDetails extends Component {
  constructor() {
    super();
    this.state = {
      title: "American god",
      posterLink: "http://picsum.photos/200",
      date: "3000",
      casts: [],
      by: "Jame brown",
      summary: "a movie",
      rated: "",
      rating: {
        imdb: "",
        mt: "",
        rt: ""
      },
      platforms: [],
      runtime: "",
      trailor: <CircularProgress />,
      id: "",

      reviews: "",
      rt_review: "",
      loading: true
    };
    this.addToWatchlist = this.addToWatchlist.bind(this);
  }
  addToWatchlist() {
    //Get username
    console.log("im added");
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    var user = decoded.identity.username;
    //Send user to backend
    axios.post("http://127.0.0.1:4897/" + user + "/watchlist", {
      movieId: this.state.id
    });
  }

  async componentDidMount() {
    let id = this.props.match.params.id;
    // update the console info
    const promise = axios.get("http://127.0.0.1:4897/result_id=" + id);
    const reponse = await promise;
    const data = reponse.data;
    let rating = {
      imdb: "Not available",
      mt: "Not available",
      rt: "Not available"
    };

    //Pass in data to backend
    // let toSend = {
    //   id: id,
    //   title: data.title,
    //   posterLink: data.poster_link,
    //   summary: data.synopsis,
    //   date: data.date,
    //   casts: data.casts,
    //   by: data.director,
    //   rated: data.AgeRestriction,
    //   runtime: data.runtime,
    //   rating: rating
    // };
    //console.log(toSend);
    axios.post("http://127.0.0.1:4897/result_id=" + id).then(res => {});

    this.setState({
      title: data.title,
      posterLink: data.poster_link,
      summary: data.synopsis,
      date: data.date,
      casts: data.casts,
      by: data.director,
      rated: data.AgeRestriction,
      runtime: data.runtime,
      rating: rating,
      id: id
    });

    const promiseReview = axios.get(
      "http://127.0.0.1:4897/moviedbreview/" + id
    );
    const reviewresponse = await promiseReview;
    const reviewDb = reviewresponse.data;

    let tmp = new Date(this.state.date);
    this.setState({ reviews: reviewDb });

    const promiseReview2 = axios.get(
      "http://127.0.0.1:4897/review/title=" +
        data.title +
        "&date=" +
        this.state.date +
        "&id=" +
        id
    );
    console.log(
      "http://127.0.0.1:4897/review/title=" +
        data.title +
        "&date=" +
        tmp.getFullYear() +
        "&id=" +
        id
    );
    const reviewresponse2 = await promiseReview2;
    const reviewDb2 = reviewresponse2.data;

    this.setState({ rt_review: reviewDb2 });
    //set youtube
    //youtube trailor

    const promise2 = axios.get(
      "http://127.0.0.1:4897/trailor/title=" +
        data.title +
        "&date=" +
        tmp.getFullYear() +
        "&id=" +
        id
    );
    const reponse2 = await promise2;
    const trailor = reponse2.data;
    this.setState({ trailor: trailor, loading: false });

    rating.imdb = data.ratings.imdb;
    rating.rt = data.ratings.rt;
    rating.mt = data.ratings.mt;
    let platforms = [];

    //push the platforms
    console.log(id);
    //itunes
    platforms.push(
      <Platform
        key={"itunes"}
        loading_link={
          "http://localhost:4897/platforms/itunes/title=" +
          '"' +
          this.state.title +
          '"' +
          "&date=" +
          this.state.date +
          "&id=" +
          id
        }
        name={"itunes"}
        icon_root="./icon/itunes.png"
        id={this.state.id}
      />
    );

    //google play

    platforms.push(
      <Platform
        key={"google play"}
        loading_link={
          "http://localhost:4897/platforms/google_play/title=" +
          '"' +
          this.state.title +
          '"' +
          "&date=" +
          this.state.date +
          "&id=" +
          id
        }
        name={"google play"}
        icon_root="./icon/itunes.png"
        id={this.state.id}
      />
    );

    //youtube

    let title_new = this.state.title.replace(" ", "_");
    console.log(this.state.date);
    platforms.push(
      <Platform
        key={"youtube"}
        loading_link={
          "http://localhost:4897/platforms/youtube/title=" +
          title_new +
          "&date=" +
          this.state.date +
          "&id=" +
          id
          //tmp.getFullYear()
        }
        name={"youtube"}
        icon_root="./icon/itunes.png"
        id={this.state.id}
      />
    );
    // set the state
    this.setState({ platforms: platforms });
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
  /*
<a
                target="_blank"
                href={"https://en.wikipedia.org/wiki/" + actor}
                style={{ textDecoration: "none" }}
              >
                <span className={this.badge()} key={actor}>
                  <div>{actor}</div>
                </span>
              </a>
<a
              target="_blank"
              href="http://localhost:3000/users/register"
              style={{ textDecoration: "none" }}
            >
              Sign Up!
            </a>
*/
  castList() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className="cast">
          {this.state.casts.map(actor => {
            return (
              //link to the wiki page of the actor
              <Zoom in key={actor}>
                <Button
                  variant="outlined"
                  classes={{ root: classes.cast_button }}
                  color={this.color_button()}
                >
                  <a
                    target="_blank"
                    href={"https://en.wikipedia.org/wiki/" + actor}
                    style={{ textDecoration: "none" }}
                  >
                    {actor}
                  </a>
                </Button>
              </Zoom>
            );
          })}

          <Button
            variant="contained"
            classes={{ root: classes.cast_button }}
            color="primary"
          >
            {" "}
            Rated - {this.state.rated}
          </Button>
        </div>
      </React.Fragment>
    );
  }
  platformsList() {
    return (
      <React.Fragment>
        <Typography component="h2" variant="display1">
          Watch now on
        </Typography>
        <div style={{ paddingTop: "40px" }}>{this.state.platforms}</div>
      </React.Fragment>
    );
  }
  ratingList() {
    let mt_string =
      "https://www.metacritic.com/movie/" +
      this.state.title.replace(" ", "-").toLowerCase();

    let rt_string =
      "https://www.rottentomatoes.com/search/?search=" + this.state.title;
    let imdb_string =
      "https://www.imdb.com/title/" + this.props.match.params.id;
    return (
      <React.Fragment>
        <Typography
          component="h2"
          variant="display1"
          style={{ paddingBottom: "10px" }}
        >
          Popular ratings
        </Typography>
        <div className="rating">
          <a
            target="_blank"
            href={imdb_string}
            className="sm-link sm-link_padding-bottom sm-link3"
          >
            <img
              className="reviewlogo"
              src={require("./icon/imdb.jpeg")}
              alt="rt"
            />
            <Typography
              variant="display1"
              style={{ paddingTop: "3%", paddingLeft: "10%" }}
            >
              {this.state.rating.imdb}
            </Typography>
          </a>
        </div>
        <div className="rating">
          <a
            target="_blank"
            href={rt_string}
            className="sm-link sm-link_padding-bottom sm-link3"
          >
            <img
              className="reviewlogo"
              src={require("./icon/rt.png")}
              alt="imdb"
            />
            <Typography
              variant="display1"
              style={{ paddingTop: "3%", paddingLeft: "10%" }}
            >
              {this.state.rating.rt}
            </Typography>
          </a>
        </div>
        <a
          target="_blank"
          href={mt_string}
          className="sm-link sm-link_padding-bottom sm-link3"
        >
          <img className="reviewlogo" src={require("./icon/mt.png")} alt="mt" />
          <Typography
            variant="display1"
            style={{ paddingTop: "3%", paddingLeft: "10%" }}
          >
            {this.state.rating.mt}
          </Typography>
        </a>
      </React.Fragment>
    );
  }

  trailor() {
    return (
      <React.Fragment>
        <Typography component="h2" variant="display1">
          Trailer
          <a
            target="_blank"
            href={
              "https://www.youtube.com/results?search_query=" +
              this.state.title +
              " " +
              this.state.date
            }
          >
            <img className="link_img" src={require("./icon/play.png")} />
          </a>
        </Typography>
        <a target="_blank" href={this.state.trailor.link}>
          <img
            style={{ paddingTop: "10px" }}
            className="trailerImg"
            src={this.state.trailor.pic}
            alt="Not available"
          />
        </a>
      </React.Fragment>
    );
  }
  handleSubmit = e => {
    console.log("1");
    const term = e.target.searchterm.value;
    this.setState({ term });
    this.props.history.push("/search/" + e.target.searchterm.value);
  };

  rt_review = () => {
    if (this.state.rt_review.review != "N/A") {
      return (
        <Grid item xs={12} style={{ paddingLeft: "17%", paddingTop: "4%" }}>
          <Paper
            style={{
              padding: "40px",
              backgroundColor: "#6ed3cf",
              fontStyle: "italic"
            }}
          >
            <Typography style={{ font: "Italic" }}>
              {this.state.rt_review.review}
            </Typography>
            <Typography style={{ paddingTop: "20px" }}>
              By- Rotten tomatoes
            </Typography>
          </Paper>
        </Grid>
      );
    }
    return "";
  };
  reviewDb = () => {
    if (this.state.reviews.content != "-1")
      return (
        <Grid item xs={12} style={{ paddingLeft: "17%", paddingTop: "4%" }}>
          <Paper
            style={{
              padding: "40px",
              backgroundColor: "lightsalmon",
              fontStyle: "italic"
            }}
          >
            <Typography style={{ font: "Italic" }}>
              {this.state.reviews.content}
            </Typography>
            <Typography style={{ paddingTop: "20px" }}>
              By- {this.state.reviews.author}
            </Typography>
          </Paper>
        </Grid>
      );
    return "";
  };
  render() {
    const { classes } = this.props;
    const watchlistButton = (
      <React.Fragment>
        <Tooltip title="Add this movie to your watch list now!">
          <Fab
            size="small"
            color="secondary"
            aria-label="Add"
            onClick={this.addToWatchlist}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </React.Fragment>
    );
    const noButton = <div />;
    if (this.state.loading) {
      return (
        <React.Fragment>
          <Grid container>
            <Paper
              style={{
                padding: 40,
                marginTop: 40,
                marginBottom: 10,
                height: "auto",
                width: "100%"
              }}
            >
              <Grid item>
                <SearchAppBar />
              </Grid>
              <Grid container>
                <CircularProgress />
              </Grid>
            </Paper>
          </Grid>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Grid container>
          <Paper
            style={{
              padding: 40,
              marginTop: 40,
              marginBottom: 10,
              height: "40cm",
              width: "100%"
            }}
          >
            <Grid item>
              <SearchAppBar />
            </Grid>
            <Grid container>
              <Grid item xs={7}>
                <Zoom in>
                  <Grid>
                    <Typography variant="h4" gutterBottom>
                      {this.state.title}
                      <a
                        target="_blank"
                        href={
                          "https://en.wikipedia.org/wiki/" + this.state.title
                        }
                      >
                        <img
                          className="logo_img"
                          src={require("./icon/wiki.png")}
                          float="left"
                        />
                      </a>
                      <Tooltip title="Give this movie a like!">
                        <Fab
                          size="small"
                          color="secondary"
                          aria-label="Add"
                          classes={{ root: classes.thumb }}
                        >
                          <ThumbUp />
                        </Fab>
                      </Tooltip>
                      <Tooltip title="I dont like it">
                        <Fab
                          size="small"
                          aria-label="Add"
                          classes={{ root: classes.thumb }}
                        >
                          <ThumbDown />
                        </Fab>
                      </Tooltip>
                    </Typography>
                  </Grid>
                </Zoom>

                <Zoom in>
                  <Typography
                    variant="subtitle1"
                    style={{ paddingTop: "1px" }}
                    gutterBottom
                  >
                    {this.state.date} ({this.state.runtime}) By {this.state.by}
                    {"               "}
                    {localStorage.usertoken ? watchlistButton : noButton}
                  </Typography>
                </Zoom>
                <div style={{ paddingTop: "6px" }}>
                  {" "}
                  <div style={{ display: "inline-block" }}>
                    <FacebookShareButton
                      url={
                        "https://localhost:3000/moviedetails/" + this.state.id
                      }
                      style={{ width: "40px" }}
                    >
                      <FacebookIcon size={25} />
                    </FacebookShareButton>
                  </div>
                  <div style={{ display: "inline-block" }}>
                    <TwitterShareButton
                      url={
                        "https://localhost:3000/moviedetails/" + this.state.id
                      }
                      style={{ width: "40px" }}
                    >
                      <TwitterIcon size={25} />
                    </TwitterShareButton>
                  </div>
                  <div style={{ display: "inline-block" }}>
                    <RedditShareButton
                      url={
                        "https://localhost:3000/moviedetails/" + this.state.id
                      }
                      style={{ width: "40px" }}
                    >
                      <RedditIcon size={25} />
                    </RedditShareButton>
                  </div>
                  <div style={{ display: "inline-block" }}>
                    <WhatsappShareButton
                      url={
                        "https://localhost:3000/moviedetails/" + this.state.id
                      }
                      style={{ width: "40px" }}
                    >
                      <WhatsappIcon size={25} />
                    </WhatsappShareButton>
                  </div>
                </div>
                <Grid>{this.castList()}</Grid>

                <Grid>
                  <Zoom in>
                    <Typography
                      variant="h6"
                      style={{ paddingTop: "10px" }}
                      gutterBottom
                    >
                      {this.state.summary}
                    </Typography>
                  </Zoom>
                </Grid>
                <Grid style={{ paddingTop: "20px" }}>{this.trailor()}</Grid>
                <Grid style={{ paddingTop: "20px" }}>{this.ratingList()}</Grid>

                <Grid item lg style={{ paddingTop: "40px" }}>
                  {this.platformsList()}
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <CardMedia
                  component="img"
                  image={this.state.posterLink}
                  classes={{ root: classes.poster }}
                />

                {this.reviewDb()}
                {this.rt_review()}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MovieDetails);
