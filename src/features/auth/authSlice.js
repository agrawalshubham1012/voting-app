import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../app/axios';

const initialState = {
  user: null,
  isLoggedIn:false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  errorMessage: '',
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (udata, thunkAPI) => {
    try {
      const response = await axios.post('/auth/login',udata);

      let data = response.data;
      if (response.status === 201 || response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      // thunkAPI.rejectWithValue(e.response.data);
      if (!err.response) {
        throw err
      }

      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    logoutAuth: (state,{payload}) => {
        state.user = {};
        state.isLoggedIn = false;
        state.isFetching = false;
        state.isSuccess = false;
        state.isError = false;
        state.errorMessage = '';
    },
    resetState: (state,{payload}) => {
      state.isLoggedIn = false;
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
  },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: {
    [loginUser.fulfilled]: (state, { payload }) => {
      console.log('payload',payload)
          state.isLoggedIn = true;
          state.user = payload;
          state.isFetching = false;
          state.isSuccess = true;
          return state;
        },
        [loginUser.pending]: (state) => {
          state.isFetching = true;
        },
        [loginUser.rejected]: (state, { payload }) => {
          state.isFetching = false;
          state.isError = true;
          if(payload){
            state.errorMessage = payload.message=='Unauthorized'?'Invalid username/password':payload.message;
          }
          else{
            state.errorMessage = 'Internal error';
          }
        }
    },
});

export const {logoutAuth,resetState} = authSlice.actions;


export const logout = () => async (dispatch, getState) => {
  try {
    dispatch(logoutAuth());
  } catch (error) {
    console.log('error',error)
    return error.response.data;
  }
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of

export const authSelector = (state) => state.auth;


export default authSlice.reducer;
