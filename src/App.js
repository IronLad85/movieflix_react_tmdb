import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { ChangeLang } from "./actions/system";
import { hideTrailer } from "./actions/movie";
import ModalVideo from "react-modal-video";
import Header from "./components/Header";
import config from "./config";
import routes from "./routes";
import { storage } from "./services";
import "./assets/styles/main.css";
import "./assets/styles/normalize.css";

class App extends Component {
  componentWillMount() {
    const { i18n, ChangeLang } = this.props;
    const lang_id = storage.get("lng");
    if (lang_id !== null) {
      ChangeLang(lang_id);
      i18n.changeLanguage(config.API_LANGUAGES.filter(lang => lang.id === Number(lang_id)).shift().title);
    }
  }

  render() {
    const { t, canShowTrailer, trailerId } = this.props;
    return (
      <div className="wrapper">
        <Header />
        <div className="app-container">{routes}</div>
        {canShowTrailer ? (
          <ModalVideo
            channel="youtube"
            isOpen={canShowTrailer}
            videoId={trailerId}
            onClose={() => {
              this.props.hideTrailer();
            }}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    canShowTrailer: state.movie.canShowTrailer,
    trailerId: state.movie.trailerId
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      hideTrailer,
      ChangeLang
    },
    dispatch
  );
export default translate("translations")(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(App)
  )
);
