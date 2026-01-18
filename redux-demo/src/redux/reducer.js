import { TOGGLE_THEME } from "./actions"

const initialState = {
  darkMode: false
}

export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return { darkMode: !state.darkMode }

    default:
      return state
  }
}
