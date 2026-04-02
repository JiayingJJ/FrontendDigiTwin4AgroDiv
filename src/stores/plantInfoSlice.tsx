import { createSlice } from '@reduxjs/toolkit';

interface PlantInfoState {
    imageSrc: string | null;
}

const initialState: PlantInfoState = {
    imageSrc: '',
}

const plantInfoSlice = createSlice({
    name: 'plantInfo',
    initialState,
    reducers: {
        setImageSrc: (state, action) => {
            state.imageSrc = action.payload;
        }
    }
});

export const {
    setImageSrc
} = plantInfoSlice.actions;

export default plantInfoSlice.reducer;