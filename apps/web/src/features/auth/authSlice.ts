import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUsers, UserLogin } from "../../apis/auth";
import { getToken, removeToken, setAuthUser, setToken } from "../../utils/auth";
import type { RootState } from "../../app/store";
import { socket } from "../../socket/socket";

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
  success:boolean;
  users?:[] | null
}

const initialState: AuthState = {
  user: null,
  token: getToken(),
  loading: false,
  error: null,
  success:false,
  users:[]
};
interface GetusersPayload {

  page: number;
  limit: number;
}

export const userLogin = createAsyncThunk(
  "auth/login",
  async (
    formData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await UserLogin(formData);

      return response;
    } catch (error) {
      return rejectWithValue("Login failed");
    }
  }
);

export const getUsers = createAsyncThunk("auth/users",async({page,limit}:GetusersPayload,{rejectWithValue})=>{
 try {
      const response = await GetUsers(page,limit);
      

      return response;
    } catch (error) {
      return rejectWithValue("Login failed");
    }
})

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      socket.disconnect()

      removeToken();
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success=false
      })

      .addCase(userLogin.fulfilled, (state, action) => {
        console.log("show action payload---->",action.payload);
        
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
        state.success=true

        setToken(action.payload.token);
        setAuthUser(action.payload.data)
        socket.auth = {
          token:action.payload.token
        }
        socket.connect()
      })

      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success=false
      })
      .addCase(getUsers.pending,state=>{
        state.success = false;
        state.loading= true;
        state.error = null;

      })
      .addCase(getUsers.fulfilled,(state,action)=>{
        state.error = null;
        state.success = true;
        state.loading = false;
        state.users = action.payload.data;

      })
      .addCase(getUsers.rejected,(state,action)=>{
        state.success = false;
        state.error = action.payload as any;
        state.loading = false
      })
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

// selectors 

export const getAuthState = (state: RootState) => state.auth;

export const getUser = (state: RootState) => state.auth.user;

export const getTokenState = (state: RootState) => state.auth.token;

export const getLoading = (state: RootState) => state.auth.loading;

export const getError = (state: RootState) => state.auth.error;
export const getUsersList = (state:RootState)=> state.auth.users

export const isAuthenticated = (state: RootState) =>
  !!state.auth.token;