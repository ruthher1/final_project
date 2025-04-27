import {createStore} from "redux"
import reducers from "./reducers/Index"

export const store=createStore(
    reducers,
    {}
)