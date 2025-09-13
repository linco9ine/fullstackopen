import { createStore, combineReducers } from "redux";
import notificationReducer from "./reducers/notificationReducer";
import blogsReducer from "./reducers/blogsReducer";
import userReducer from "./reducers/userReducer";

const rootReducer = combineReducers({
  notification: notificationReducer,
  blogs: blogsReducer,
  users: userReducer,
});

const store = createStore(rootReducer);

export default store;
