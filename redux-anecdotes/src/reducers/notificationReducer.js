import { createSlice  } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        showNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return action.payload
        }
    }
})

export const { showNotification, clearNotification } =
notificationSlice.actions

export const setNotification = (content, seconds) => {
    const ms = 1000*seconds
    return dispatch => {
        dispatch(showNotification(content))
        setTimeout(() => {
            dispatch(clearNotification(''))
        }, ms)
    }
}

export default notificationSlice.reducer
