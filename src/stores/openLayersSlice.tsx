import { createSlice } from '@reduxjs/toolkit';

interface OpenLayersState {
    layerType: string | null;
}

const initialState: OpenLayersState = {
    layerType: 'standard',
}

const openLayersSlice = createSlice({
    name: 'openLayers',
    initialState,
    reducers: {
        setLayerType: (state, action) => {
            state.layerType = action.payload;
        }
    }
});

export const {
    setLayerType
} = openLayersSlice.actions;

export default openLayersSlice.reducer;