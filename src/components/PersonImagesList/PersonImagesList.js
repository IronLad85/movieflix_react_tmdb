import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { translate } from "react-i18next";
import { PhotoSwipeGallery } from "react-photoswipe";
import "react-photoswipe/lib/photoswipe.css";
import "./style.scss";

import { LoadPersonImages } from "../../actions/person_images";

import config from "../../config";

class PersonImagesList extends Component {
  componentDidMount() {
    const { match, LoadPersonImages } = this.props;
    LoadPersonImages(match.params.person_id).then(() => {
      setTimeout(this.renderEmptyInList.bind(this), 100);
    });
  }

  imageLoaded = e => {
    e.target.classList.add("img-loaded");
  };

  getThumbnailContent = item => {
    return <img src={item.thumbnail} onLoad={this.imageLoaded} alt={item.thumbnail} />;
  };

  renderEmptyInList() {
    let containerRef = document.getElementsByClassName("pswp-thumbnails")[0];
    let fillHolderCount = document.getElementsByClassName("personList-fillholder").length;
    let noOfTotalImages = (this.props.images || []).length;
    if (containerRef && !fillHolderCount && noOfTotalImages % 7 !== 0) {
      let noOfPlaceHolders = 7 - (noOfTotalImages % 7);
      if (noOfPlaceHolders >= 1) {
        for (let i = 1; i <= noOfPlaceHolders; i++) {
          let element = document.createElement("div");
          element.className = "personList-fillholder";
          containerRef.appendChild(element);
        }
      }
    }
  }

  render() {
    const { images, isFetched, t } = this.props;

    if (!isFetched)
      return (
        <div className="person-images-container">
          <div className="loading-box"></div>
        </div>
      );

    let profiles = images.map(image => ({
      src: `${config.API_IMAGE.original}/${image.file_path}`,
      thumbnail: `${config.API_IMAGE.small}/${image.file_path}`,
      w: image.width,
      h: image.height
    }));

    return (
      profiles.length > 0 && (
        <div className="person_images">
          <div className="title">{t("Photos")}</div>
          <PhotoSwipeGallery items={profiles} options={{}} thumbnailContent={this.getThumbnailContent} />
        </div>
      )
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      LoadPersonImages
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    images: state.person_images.all,
    isFetched: state.person_images.isFetched
  };
};

export default translate("translations")(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(PersonImagesList)
  )
);
