import { CHANGE_LANGUAGE, SAVE_LANGUAGE } from "../actions/ActiveLanguageAction.js"

const LOCAL_KEY = "textContent"

function loadStorage() {
  let textContent = JSON.parse(localStorage.getItem(LOCAL_KEY))
  if (!textContent) {
    throw "nothing"
  }
  return textContent
}

function defaultState() {
  try {
    return loadStorage()
  }catch(err) {
    return {
      "lang" : "en",
      "saved": "en",
      "loaded" : false,
      "name" : "English",
      "native": "English",
      "words": {},
    }
  }
}

const ActiveLanguageReducer = (state = defaultState(), action) => {
  switch (action.type) {
  case CHANGE_LANGUAGE:
    state = {
      "lang" : action.payload.lang.code,
      "saved": state.saved,
      "loaded" : state.loaded,
      "name" : action.payload.lang.name,
      "native": action.payload.lang.native,
      "words": state.words,
    }
    localStorage.setItem( LOCAL_KEY, JSON.stringify(state) )
    break

  case SAVE_LANGUAGE:
    state = {
      "lang" : action.payload.content.code || state.lang,
      "saved": action.payload.content.code || state.lang,
      "loaded" : true,
      "name" : action.payload.content.name || state.name,
      "native": action.payload.content.native || state.native,
      "words": action.payload.content.words,
    }
    localStorage.setItem( LOCAL_KEY, JSON.stringify(state) )
    break

  default:
    break
  }
  return state
}
export default ActiveLanguageReducer
