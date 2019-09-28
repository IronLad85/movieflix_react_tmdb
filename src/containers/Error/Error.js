import React, { Component } from "react";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import "./style.scss";

class Error extends Component {
  render() {
    const { t } = this.props;

    return (
      <div>
        <Helmet>
          <title>{t("Error")}</title>
        </Helmet>
        <div>Error</div>
      </div>
    );
  }
}

export default translate("translations")(Error);
