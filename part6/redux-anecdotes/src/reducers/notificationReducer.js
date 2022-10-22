import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: [ null, null ],
  reducers: {
    pop(state, action) { 
      // https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout
      clearTimeout(state[1])
      return [ action.payload.notificationmessage, action.payload.timeoutID ]
    },
    vanish(state, action) { return [ null, state[1] ] }
  }
})

export const notify = (notificationmessage, showtimeinseconds) => {
  return dispatch => {
    const timeoutID = setTimeout(() => {
      dispatch(vanish())
    }, showtimeinseconds * 1000)
    dispatch(pop({ notificationmessage, timeoutID }))
  }
}

export const { pop, vanish } = notificationSlice.actions
export default notificationSlice.reducer