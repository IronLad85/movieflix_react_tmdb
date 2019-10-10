import React, { Component } from "react";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import MoviesFilter from "../../components/MoviesFilter";
import MoviesList from "../../components/MoviesList";
import "./style.scss";

class Home extends Component {
  static path = "/:page(\\d+)?";

  componentDidMount() {}

  render() {
    const { t } = this.props;

    return (
      <div className="generic-background scroll-view">
        <div className="movies fluid-container">
          <Helmet>
            <title>{t("MovieFlix")}</title>
          </Helmet>
          <MoviesFilter />
          <MoviesList />
        </div>
      </div>
    );
  }
}
export default translate("translations")(Home);
