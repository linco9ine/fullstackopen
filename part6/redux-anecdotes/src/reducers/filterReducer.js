import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filter: (state, action) => {
      return action.payload
    }
  }
})

export default filterSlice.reducer
export const { filter } = filterSlice.actions
