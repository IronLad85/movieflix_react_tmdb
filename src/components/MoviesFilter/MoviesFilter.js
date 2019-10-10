import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { translate } from "react-i18next";
import _ from "underscore";
import Select from "react-select";
import "./style.scss";

import { storage } from "../../services";
import { ChangeFilter, ChangeGenre } from "../../actions/movies";

class MoviesFilter extends Component {
  state = {
    selectedOption: null,
    options: []
  };

  componentWillMount() {
    const { t, genres } = this.props;
    const options = [
      { label: t("Popular"), value: "popular" },
      { label: t("Top rated"), value: "top_rated" },
      { label: t("Upcoming"), value: "upcoming" }
    ];
    let filterStorage = storage.get("filter");
    let genre;
    if (filterStorage) {
      filterStorage = _.filter(options, option => option.value == filterStorage)[0];
      if (filterStorage !== null) this.props.ChangeFilter(filterStorage.value);
    }
    this.setState({
      options,
      selectedGenre: genre,
      selectedOption: filterStorage || { label: t("Popular"), value: "popular" }
    });
  }

  componentWillReceiveProps(props) {
    if ((props.genres || []).length) {
      let genreList = _.map(props.genres, obj => {
        return { label: obj.name, value: obj.id };
      });
      genreList.unshift({ value: "", label: "All" });
      let genre = _.filter(props.genres, option => option.value == props.genre)[0];
      this.setState({ genreList });
    }
  }

  onTypeChange = selectedOption => {
    this.setState({ selectedOption: selectedOption }, () => {
      this.props.ChangeFilter(selectedOption.value);
    });
  };

  onGenreChange = genre => {
    this.setState({ selectedGenre: genre }, () => {
      if (genre.value) {
        this.props.ChangeGenre(genre.value);
      } else {
        this.props.ChangeGenre(null);
        storage.clean("genre");
      }
    });
  };

  render() {
    return (
      <div className="movies-filter">
        <div className="filter-content">
          <div className="select-box">
            <Select
              value={this.state.selectedGenre}
              defaultValue={{ label: "All", value: "All" }}
              onChange={this.onGenreChange}
              options={this.state.genreList}
              styles={selectStyles}
            />
          </div>
          <div className="select-box">
            <Select
              styles={selectStyles}
              value={this.state.selectedOption}
              onChange={this.onTypeChange}
              options={this.state.options}
            />
          </div>
        </div>
        {/* {filters.map(item => (
            <li
              key={item.slug}
              className={item.slug === filter ? "active" : ""}
              onClick={() => this.ChangeFilter(item.slug)}>
              {item.title}
            </li> */}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ChangeFilter,
      ChangeGenre
    },
    dispatch
  );
const mapStateToProps = state => {
  return {
    filter: state.movies.filter,
    genres: state.genres.all,
    genre: state.movies.genre
  };
};
export default translate("translations")(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MoviesFilter)
);

const selectStyles = {
  control: styles => ({ ...styles, backgroundColor: "transparent" }),
  input: styles => ({ fontSize: 14, color: "white" }),
  singleValue: styles => {
    return { ...styles, fontSize: 14, color: "white" };
  },
  option: (styles, state) => {
    return {
      ...styles,
      fontSize: 14,
      color: state.isFocused ? "#fff" : state.isSelected ? "#fff" : "#777",
      padding: "7px",
      backgroundColor: state.isSelected ? "#3bb33b" : state.isFocused ? "#d28800" : "#fff",
      fontWeight: "bold"
    };
  },
  placeholder: styles => ({ ...styles }),
  container: styles => ({ ...styles, backgroundColor: "transparent" })
};
