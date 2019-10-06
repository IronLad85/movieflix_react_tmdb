import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { translate } from "react-i18next";
import _ from "underscore";
import "./style.scss";

import config from "../../config";

import { LoadMovie, LoadMovieVideo } from "../../actions/movie";
import { LoadMovieCredits } from "../../actions/credits";
import { LoadGenres } from "../../actions/genres";
import MaterialIcon from "material-icons-react";

import CreditList from "../../components/CreditList";
import ImagesList from "../../components/ImagesList";
import RecommendationsList from "../../components/RecommendationsList";
import ModalVideo from "react-modal-video";

class Movie extends Component {
  static path = "/movie/:movie_id(\\d+)/:cast?";

  constructor(props) {
    super(props);
    this.state = { canShowVideoModal: false };
  }

  componentDidMount() {
    const { match, LoadMovie, LoadMovieVideo, LoadGenres } = this.props;
    LoadGenres();
    LoadMovie(match.params.movie_id);
    LoadMovieVideo(match.params.movie_id);
  }

  componentWillReceiveProps(nextProps) {
    const { match, LoadMovie, currentLangID } = this.props;
    if (
      match.params.movie_id !== nextProps.match.params.movie_id ||
      Number(nextProps.currentLangID) !== Number(currentLangID)
    ) {
      LoadMovie(nextProps.match.params.movie_id);
    }
  }

  convertMinsToHrsMins = mins => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? h : h;
    m = m < 10 ? "0" + m : m;
    return `${h}:${m}`;
  };

  moneySpace = money => {
    let parts = money.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  };

  renderMovieInfoRow(t, movie) {
    return (
      <div className="movie-info-row">
        {movie.release_date ? (
          <div className="movie-item">
            <span>{t("Release date")}:</span>
            {movie.release_date}
          </div>
        ) : null}
        {movie.budget ? (
          <div className="movie-item">
            <span>{t("Budget")}:</span>$ {this.moneySpace(movie.budget)}
          </div>
        ) : null}
        {movie.revenue ? (
          <div className="movie-item">
            <span>{t("Revenue")}:</span>$ {this.moneySpace(movie.revenue)}
          </div>
        ) : null}
        <div className="movie-item">
          <span>{t("Duration")}:</span>
          {this.convertMinsToHrsMins(movie.runtime)}
        </div>
      </div>
    );
  }

  renderTrailerButtons() {
    let videos = this.props.videos;
    return (
      <div>
        {videos.map((video, index) => (
          <div
            key={index}
            className="trailer-button"
            onClick={() => {
              this.setState({ canShowVideoModal: true, selectedVideoId: video.key });
            }}>
            <MaterialIcon icon="play_circle_filled" className="material-icons trailer-button-icon" />
            <div>Play Trailer {videos.length > 1 ? index + 1 : ""}</div>
          </div>
        ))}
      </div>
    );
  }

  onBackgroundLoad = e => {
    e.target.classList.add("bg-loaded-transition");
  };

  imageLoaded = e => {
    e.target.classList.add("img-loaded");
  };

  render() {
    const { movie, isFetched, t } = this.props;

    if (!isFetched) return <div className="loading-box"></div>;
    return (
      <div className="scroll-view">
        <div className="blur-backdrop">
          <img
            src={`${config.API_IMAGE.large}/${movie.backdrop_path}`}
            className="backdrop-img"
            onLoad={this.onBackgroundLoad}
          />
        </div>
        <div className="fluid-container" style={{ zIndex: 10 }}>
          <div className="single-movie-info">
            <div className="single-movie-info-inner">
              <div className="movie-info-primary">
                <div className={`movie-rating ${movie.vote_average >= 7 && "movie-rating-positive"}`}>
                  {movie.vote_average}
                </div>
                <div className="movie-poster">
                  <img src={`${config.API_IMAGE.large}/${movie.poster_path}`} onLoad={this.imageLoaded} />
                </div>
                <div className="movie-details">
                  <div className="movie-title">{movie.title}</div>
                  {movie.overview ? (
                    <div className="movie-description">
                      <span>{t("Overview")}:</span>
                      {movie.overview}
                    </div>
                  ) : null}
                  {this.renderMovieInfoRow(t, movie)}
                  <ul className="movie-genres">
                    {movie.genres &&
                      movie.genres.map(item => {
                        return <li key={item.id}>{item.name}</li>;
                      })}
                  </ul>
                  {this.renderTrailerButtons()}
                </div>
              </div>
            </div>
            <CreditList />
            <ImagesList />
          </div>
          <RecommendationsList />
        </div>
        <ModalVideo
          channel="youtube"
          isOpen={this.state.canShowVideoModal}
          videoId={this.state.selectedVideoId}
          onClose={() => this.setState({ canShowVideoModal: false })}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      LoadMovie,
      LoadMovieVideo,
      LoadGenres,
      LoadMovieCredits
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    movie: state.movie.data,
    isFetched: state.movie.isFetched,
    videos: _.values(state.movie.videos).filter(video => video.type === "Trailer") || [],
    currentLangID: state.system.currentLangID
  };
};

export default translate("translations")(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Movie)
);
