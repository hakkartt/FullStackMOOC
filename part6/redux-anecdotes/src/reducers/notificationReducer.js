import { createSlice } from "@reduxjs/toolkit"

const initialState = 'render notification here...'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {}
})

export default notificationSlice.reducer