import React, { Component } from "react";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./style.scss";

import MoviesList from "../../components/MoviesList";
import { LoadSearchMovies, ClearSearchText } from "../../actions/movies";
import _ from "underscore";

class Search extends Component {
  static path = "/search/:query/:page?";

  componentDidMount() {
    const { match, LoadSearchMovies } = this.props;
    LoadSearchMovies(match.params.query, match.params.page);
  }

  componentWillReceiveProps(nextProps) {
    const { match, LoadSearchMovies, currentLangID } = this.props;
    if (
      Number(nextProps.currentLangID) !== Number(currentLangID) ||
      nextProps.match.params.query !== match.params.query ||
      nextProps.match.params.page !== match.params.page
    ) {
      LoadSearchMovies(nextProps.match.params.query, nextProps.match.params.page);
    }
  }

  componentWillUnmount() {
    this.props.ClearSearchText();
  }

  render() {
    const { t } = this.props;
    return (
      <div className="generic-background scroll-view">
        <div className="movies fluid-container">
          <Helmet>
            <title>{t("MovieFlix")}</title>
          </Helmet>
          <MoviesList />
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      LoadSearchMovies,
      ClearSearchText
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    searchText: state.movies.searchText
  };
};

export default translate("translations")(
  withRouter(
    connect(
      null,
      mapDispatchToProps
    )(Search)
  )
);
