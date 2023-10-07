import {createSlice} from '@reduxjs/toolkit';

//setting initail state
const initialState = {
    currentUser: null,
    error: null,
    loading: null
};

//setting the user slice 
const userSlice = createSlice({
    name: 'user',
    initialState,

    //creating the reducers
    reducers:{
        signInStart: (state)=>{
          state.loading = true
        },
        signInSuccess: (state, action)=>{
            state.currentUser = action.payload,
            state.loading = true,
            state.error = null
        },
        signInFailure: (state, action)=>{
            state.error = action.payload,
            state.loading = false
        }
    }
})


export const {signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;