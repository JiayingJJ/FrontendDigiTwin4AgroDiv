import { createSlice } from '@reduxjs/toolkit';

interface OpenLayersState {
    layerType: string | null;
    drawingInteraction: boolean;
    addDrawedInteractionInfo: boolean;
    geometry: [] | null;
    geometryType: string | null;
}

const initialState: OpenLayersState = {
    layerType: 'standard',
    drawingInteraction: false,
    addDrawedInteractionInfo: false,
    geometry: null,
    geometryType: null
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
        },
        setGeometry: (state, action) => {
            state.geometry = action.payload;
        },
        clearGeometry: (state, action) => {
            state.geometry = null;
        },
        setGeometryType: (state, action) => {
            state.geometryType = action.payload;
        }
    }
});

export const {
    setLayerType,
    setDrawingInteraction,
    setAddDrawedInteractionInfo,
    setGeometry,
    setGeometryType
} = openLayersSlice.actions;

export default openLayersSlice.reducer;