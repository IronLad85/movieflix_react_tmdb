import * as Actions from "../actions/movie";
const initialState = {
  data: {},
  isFetched: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.LOAD_MOVIE_REQUEST:
      return {
        ...state,
        data: {},
        isFetched: false
      };
    case Actions.LOAD_MOVIE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetched: true
      };
    case Actions.LOAD_MOVIE_VIDEO_REQUEST:
      return {
        ...state,
        areVideosFetched: false
      };
    case Actions.LOAD_MOVIE_VIDEO_SUCCESS:
      return {
        ...state,
        videos: action.payload.results,
        areVideosFetched: true
      };
    case Actions.SHOW_TRAILER:
      return {
        ...state,
        trailerId: action.payload.trailerId,
        canShowTrailer: action.payload.canShowTrailer
      };
    case Actions.HIDE_TRAILER:
      return {
        ...state,
        trailerId: null,
        canShowTrailer: false
      };
    default:
      return state;
  }
};
