import { configureStore } from '@reduxjs/toolkit';
import OpenLayersMapReducer from '../stores/openLayersSlice';
import PlantInfoReducer from '../stores/plantInfoSlice';
import AlertInfoReducer from '../stores/alertInfoSlice';
import UserReducer from '../stores/userSlice';
const store = configureStore({
    reducer: {
        user: UserReducer,
        openlayers: OpenLayersMapReducer,
        plantInfo: PlantInfoReducer,
        alertInfo: AlertInfoReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

store.subscribe(() => {
    const state = store.getState();
    console.log(state)
})
export default store;