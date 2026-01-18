import { createStore } from "redux"
import { themeReducer } from "./reducer"

export const store = createStore(themeReducer)
