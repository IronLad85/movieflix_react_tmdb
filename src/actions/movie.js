import { api } from "../services";

export const LOAD_MOVIE_REQUEST = "LOAD_MOVIE_REQUEST";
export const LOAD_MOVIE_SUCCESS = "LOAD_MOVIE_SUCCESS";
export const LOAD_MOVIE_ERROR = "LOAD_MOVIE_ERROR";

export const LOAD_MOVIE_VIDEO_REQUEST = "LOAD_MOVIE_VIDEO_REQUEST";
export const LOAD_MOVIE_VIDEO_SUCCESS = "LOAD_MOVIE_VIDEO_SUCCESS";
export const LOAD_MOVIE_VIDEO_ERROR = "LOAD_MOVIE_VIDEO_ERROR";

export const LoadMovie = movie_id => {
  return dispatch => {
    dispatch(onLoadMovie.request());
    return onLoadMovie
      .fetch(movie_id)
      .then(({ data }) => {
        dispatch(onLoadMovie.success(data));
      })
      .catch(error => {
        dispatch(onLoadMovie.error(error));
      });
  };
};

export const LoadMovieVideo = movie_id => {
  return dispatch => {
    dispatch(onLoadMovieVideo.request());
    return onLoadMovieVideo
      .fetch(movie_id)
      .then(({ data }) => {
        dispatch(onLoadMovieVideo.success(data));
      })
      .catch(error => {
        dispatch(onLoadMovieVideo.error(error));
      });
  };
};

const onLoadMovieVideo = {
  request: () => ({
    type: LOAD_MOVIE_VIDEO_REQUEST
  }),
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
