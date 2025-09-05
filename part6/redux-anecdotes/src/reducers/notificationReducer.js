import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notification: (state, action) => {
      return action.payload
    }
  }
})

export const { notification } = notificationSlice.actions

export const setNotification = (msg, sec) => {
  return (dispatch) => {
    dispatch(notification(msg))
    setTimeout(() => {
      dispatch(notification(''))
    }, sec * 1000)
  }
}

export default notificationSlice.reducer
