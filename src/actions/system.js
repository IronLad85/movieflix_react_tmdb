import { storage } from "../services";

var CHANGE_LANGUAGE = "CHANGE_LANGUAGE";

const ChangeLang = lang_id => {
  return dispatch => {
    dispatch(onChangeLang.request(lang_id));
  };
};

const onChangeLang = {
  request: lang_id => {
    storage.set("lng", Number(lang_id));
    return {
      type: CHANGE_LANGUAGE,
      payload: lang_id
    };
  }
};

export { CHANGE_LANGUAGE, ChangeLang };
