import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { translate } from "react-i18next";
import { PhotoSwipeGallery } from "react-photoswipe";
import "react-photoswipe/lib/photoswipe.css";
import "./style.scss";

import { LoadMovieImages } from "../../actions/images";

import config from "../../config";

class MoviesList extends Component {
  componentDidMount() {
    const { match, LoadMovieImages } = this.props;
    LoadMovieImages(match.params.movie_id).then(() => {
      setTimeout(() => {
        this.renderEmptyInList();
      }, 200);
    });
  }

  imageLoaded = e => {
    e.target.classList.add("img-loaded");
  };

  getThumbnailContent = item => {
    return <img src={item.thumbnail} onLoad={this.imageLoaded} alt="img" />;
  };

  renderEmptyInList() {
    let containerRef = document.getElementsByClassName("pswp-thumbnails")[0];
    let fillHolderCount = document.getElementsByClassName("imgList-fillholder").length;
    let noOfTotalImages = (this.props.images.backdrops || []).length;
    if (containerRef && !fillHolderCount && noOfTotalImages % 5 !== 0) {
      let noOfPlaceHolders = 5 - (noOfTotalImages % 5);
      if (noOfPlaceHolders >= 1) {
        for (let i = 1; i <= noOfPlaceHolders; i++) {
          let element = document.createElement("div");
          element.className = "imgList-fillholder";
          containerRef.appendChild(element);
        }
      }
    }
  }

  render() {
    const { images, isFetched, t } = this.props;
    if (!isFetched)
      return (
        <div className="movies-list-container">
          <div className="loading-box"></div>
        </div>
      );

    let backdrops = images.backdrops.map(image => ({
      src: `${config.API_IMAGE.original}/${image.file_path}`,
      thumbnail: `${config.API_IMAGE.small}/${image.file_path}`,
      w: image.width,
      h: image.height
    }));
    return (
      backdrops.length > 0 && (
        <div className="images">
          <div className="title">{t("Images")}</div>
          <PhotoSwipeGallery items={backdrops} options={{}} thumbnailContent={this.getThumbnailContent} />
        </div>
      )
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      LoadMovieImages
    },
    dispatch
  );

const mapStateToProps = state => {
  return {
    images: state.images.all,
    isFetched: state.images.isFetched
  };
};

export default translate("translations")(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(MoviesList)
  )
);
