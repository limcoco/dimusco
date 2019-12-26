import Request from "../../../utils/Request";
import auth from '../../account/authToken';

export const CHANGE_LIBRARY_SCORE = Symbol("CHANGE_LIBRARY_SCORE");

export const changeLibraryScope = (data, onSuccess, history, prid) => (dispatch) => {
  const headers = {
    Authorization: "Token " + auth.getActiveToken(),
  }
  
  Request(
    'post',
    'score-copy',
    headers,
    data,
    [],
    (response) => {
      response && dispatch({
        type: CHANGE_LIBRARY_SCORE,
        payload: response.data
      })
      if(response.data.original === false){
        history.push({
          pathname: `/mod_page/${response.data.aid}/`,
          state: {...response.data, prid}
        })
      } else {
        onSuccess && onSuccess()
      }
    },
    (err)=>{
      console.error(err)
    },
    data
  );
}