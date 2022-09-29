import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    pop(state, action) { return action.payload },
    vanish(state, action) { return null }
  }
})

export const { pop, vanish } = notificationSlice.actions
export default notificationSlice.reducer