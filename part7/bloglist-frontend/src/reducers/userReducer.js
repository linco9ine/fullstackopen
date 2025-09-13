const userReducer = (state = { user: {}, users: [] }, action) => {
  switch (action.type) {
    case "USER":
      return { ...state, user: action.payload };
    case "USERS":
      return { ...state, users: action.payload }
    default:
      return state;
  }
};

export default userReducer;
