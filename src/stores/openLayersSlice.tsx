import { createSlice } from '@reduxjs/toolkit';

interface OpenLayersState {
    layerType: string | null;
    drawInteraction: boolean;
}

const initialState: OpenLayersState = {
    layerType: 'standard',
    drawInteraction: false
}

const openLayersSlice = createSlice({
    name: 'openLayers',
    initialState,
    reducers: {
        setLayerType: (state, action) => {
            state.layerType = action.payload;
        },
        setDrawInteraction: (state, action) => {
            state.drawInteraction = action.payload;
        }
    }
});

export const {
    setLayerType,
    setDrawInteraction
} = openLayersSlice.actions;

export default openLayersSlice.reducer;