const blogsReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_BLOGS":
      return action.payload;
    case "ADD_BLOG":
      return state.concat(action.payload);
    case "DELETE_BLOG":
      return state.filter((blog) => blog.id !== action.payload);
    case "LIKE_BLOG":
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      );
    case "ADD_COMMENT":
      return state.map((blog) => {
        if (blog.id === action.payload.id) {
          return action.payload;
        }
        return blog;
      });
    default:
      return state;
  }
};

export default blogsReducer;
