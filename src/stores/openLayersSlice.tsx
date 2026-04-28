import { createSlice } from '@reduxjs/toolkit';

interface OpenLayersState {
    layerType: string | null;
    drawingInteraction: boolean;
    addDrawedInteractionInfo: boolean;
}

const initialState: OpenLayersState = {
    layerType: 'standard',
    drawingInteraction: false,
    addDrawedInteractionInfo: false

}

const openLayersSlice = createSlice({
    name: 'openLayers',
    initialState,
    reducers: {
        setLayerType: (state, action) => {
            state.layerType = action.payload;
        },
        setDrawingInteraction: (state, action) => {
            state.drawingInteraction = action.payload;
        },
        setAddDrawedInteractionInfo: (state, action) => {
            state.addDrawedInteractionInfo = action.payload;
        }
    }
});

export const {
    setLayerType,
    setDrawingInteraction,
    setAddDrawedInteractionInfo
} = openLayersSlice.actions;

export default openLayersSlice.reducer;