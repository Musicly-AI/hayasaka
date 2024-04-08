import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reload: false,
};

const reloadHomePageDataSlice = createSlice({
    name: "reloadHomePageData",
    initialState,
    reducers: {
        setReload: (state, action) => {
            state.reload = action.payload;
        },
    },
})

export const { setReload } = reloadHomePageDataSlice.actions;
export default reloadHomePageDataSlice.reducer;

