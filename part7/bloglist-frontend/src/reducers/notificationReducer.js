const notificationReducer = (
  state = { msg: "", whatIsIt: "message" },
  action
) => {
  switch (action.type) {
    case "NOTIFICATION":
      if (state.whatIsIt === "error" && !action.payload.whatIsit) {
        action.payload.whatIsIt = "message";
      }
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default notificationReducer;
