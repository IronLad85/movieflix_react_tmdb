import { api } from "../services";
import _ from "underscore";
export const LOAD_MOVIE_REQUEST = "LOAD_MOVIE_REQUEST";
export const LOAD_MOVIE_SUCCESS = "LOAD_MOVIE_SUCCESS";
export const LOAD_MOVIE_ERROR = "LOAD_MOVIE_ERROR";

export const LOAD_MOVIE_VIDEO_REQUEST = "LOAD_MOVIE_VIDEO_REQUEST";
export const LOAD_MOVIE_VIDEO_SUCCESS = "LOAD_MOVIE_VIDEO_SUCCESS";
export const LOAD_MOVIE_VIDEO_ERROR = "LOAD_MOVIE_VIDEO_ERROR";

export const SHOW_TRAILER = "SHOW_TRAILER";
export const HIDE_TRAILER = "HIDE_TRAILER";

export const LoadMovie = movie_id => {
  let movieData = null;
  return dispatch => {
    dispatch(onLoadMovie.request());
    return onLoadMovie
      .fetch(movie_id)
      .then(({ data }) => {
        movieData = data;
        onLoadMovieVideo.request();
        dispatch(onLoadMovie.success({ ...data, videoData: [] }));
        return onLoadMovieVideo.fetch(movie_id);
      })
      .then(videoData => {
        dispatch(
          onLoadMovie.success({
            ...movieData,
            videoData: _.values(videoData.data.results).filter(video => video.type === "Trailer") || []
          })
        );
      })
      .catch(error => {
        dispatch(onLoadMovie.error(error));
      });
  };
};

export const showTrailer = trailerId => {
  return dispatch => {
    dispatch({
      type: SHOW_TRAILER,
      payload: { trailerId, canShowTrailer: true }
    });
  };
};

export const hideTrailer = () => {
  return dispatch => {
    dispatch({
      type: HIDE_TRAILER,
      payload: { trailerId: null, canShowTrailer: false }
    });
  };
};

const onLoadMovieVideo = {
  request: () => {
    return {
      type: LOAD_MOVIE_VIDEO_REQUEST
    };
  },
  fetch: movie_id => {
    return api.request.get(`/movie/${movie_id}/videos`);
  },
  success: payload => {
    return {
      type: LOAD_MOVIE_VIDEO_SUCCESS,
      payload
    };
  },
  error: payload => {
    return {
      type: LOAD_MOVIE_VIDEO_ERROR,
      errors: payload
    };
  }
};

const onLoadMovie = {
  request: () => ({
    type: LOAD_MOVIE_REQUEST
  }),
  fetch: movie_id => {
    return api.request.get(`/movie/${movie_id}`);
  },
  success: payload => {
    return {
      type: LOAD_MOVIE_SUCCESS,
      payload
    };
  },
  error: payload => ({
    type: LOAD_MOVIE_ERROR,
    errors: payload
  })
};
