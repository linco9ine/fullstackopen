const notificationReducer = (state, action) => {
  if (action.type === 'MESSAGE') {
    return action.payload
  }

  return state
}

export default notificationReducer
