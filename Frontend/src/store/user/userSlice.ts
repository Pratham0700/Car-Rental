import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type{ IProfile, IUserSlice} from '../../Data/AppInterface'
import axiosInstance from '../../component/axiosInstance'

const initialState: IUserSlice = {
    profile:null,
    isLoggedIn:false,
    isLoading:true,
    error:null
}
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async () => {
    const res = await axiosInstance.get("/profile");
    return res.data.data;
  }
);
export const userslice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.profile = null;
      state.isLoggedIn = false;
      state.isLoading =false;
      state.error = null;

      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshtoken");
    },
    updateUser:(state,action:PayloadAction<IProfile>)=>{
        state.profile=action.payload
            state.isLoggedIn = true;
            state.isLoading=false;
    }
},
    extraReducers:(builder)=>{
        builder
        
        .addCase(fetchProfile.pending,(state)=>{
            state.isLoading=true;
            state.error=null
        })
        .addCase(fetchProfile.fulfilled,(state,action:PayloadAction<IProfile>)=>{
            state.profile=action.payload
            state.isLoggedIn = true;
            state.isLoading=false;
            
        })
        .addCase(fetchProfile.rejected,(state,action)=>{
            state.profile=null;
            state.isLoggedIn=false;
            state.isLoading=false;
            state.error=action.error.message ?? null
            localStorage.removeItem("accesstoken");
            localStorage.removeItem("refreshtoken");
        })

    }
});
export const { logout,updateUser} = userslice.actions

export default userslice.reducer