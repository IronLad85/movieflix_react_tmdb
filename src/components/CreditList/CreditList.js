import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./style.scss";

import CreditItem from "../../components/CreditItem";
import { LoadMovieCredits } from "../../actions/credits";
import { translate } from "react-i18next";
import { findRepos } from "jest-changed-files";

class CreditList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleAll: props.match.params.cast !== undefined ? true : false
    };
  }

  componentDidMount() {
    const { match, LoadMovieCredits } = this.props;
    LoadMovieCredits(match.params.movie_id);
  }

  showAll = () => {
    this.setState({
      visibleAll: !this.state.visibleAll
    });

    // if (this.state.visibleAll) history.push(`/movie/${match.params.movie_id}`);
    // else history.push(`/movie/${match.params.movie_id}/cast`);
  };

  getCreditRow(credits) {
    return credits.map((credit, index) =>
      credit != "FILL_EMPTY" ? (
        <CreditItem key={credit.id} credit={credit} />
      ) : (
        <div key={index} className="credit-fillholder" />
      )
    );
  }

  chuckArray(credits) {
    return Array.from({ length: Math.ceil(credits.length / 8) }, (v, i) => {
      let subCreditArray = credits.slice(i * 8, (i + 1) * 8);
      if (subCreditArray.length == 8) {
      } else {
        for (let i = subCreditArray.length; i < 8; i++) {
          subCreditArray.push("FILL_EMPTY");
        }
      }
      return subCreditArray;
    });
  }

  render() {
    var { credits, isFetched, t } = this.props;
    credits = credits.filter(credit => !!credit.profile_path);
    let creditsArray = this.chuckArray(credits);

    if (!this.state.visibleAll) creditsArray = creditsArray.slice(0, 1);

    if (!isFetched)
      return (
        <div className="credits">
          <div className="loading-box"></div>
        </div>
      );

    return (
      <div className="credits">
        <div className="credits-title">
          {t("Top Billed Cast")}
          {credits.length > 8 && (
            <span
              className={this.state.visibleAll ? "active show-all-button" : "show-all-button"}
              onClick={this.showAll}>
              {t(this.state.visibleAll ? "Show Less" : "Show More")}
            </span>
          )}
        </div>
        {creditsArray.map((credits, index) => {
          return (
            <div className="credits-inline" key={index}>
              {this.getCreditRow(credits)}
            </div>
          );
        })}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      LoadMovieCredits
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    credits: state.credits.all,
    isFetched: state.credits.isFetched
  };
};

export default translate("translations")(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(CreditList)
  )
);
