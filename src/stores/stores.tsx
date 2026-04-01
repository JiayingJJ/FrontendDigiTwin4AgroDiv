import { configureStore } from '@reduxjs/toolkit';
import OpenLayersMapReducer from '../stores/openLayersSlice';
const store = configureStore({
    reducer: {
        openlayers: OpenLayersMapReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// store.subscribe(() => {
//     const state = store.getState();
//     console.log(state)
// })
export default store;