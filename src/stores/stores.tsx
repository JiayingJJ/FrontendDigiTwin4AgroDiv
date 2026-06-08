import { configureStore } from '@reduxjs/toolkit';
import OpenLayersMapReducer from '../stores/openLayersSlice';
import PlantInfoReducer from '../stores/plantInfoSlice';
import AlertInfoReducer from '../stores/alertInfoSlice';
import UserReducer from '../stores/userSlice';
import PageReducer from '../stores/pageSlice';
import DatasetTableReducer from '../stores/datasetTableSlice';
import ModalInfoReducer from '../stores/modalInfoSlice';
import DatasetTableViewReducer from '../stores/datasetTableViewSlice';
import InternetReducer from '../stores/internetSlice';
const store = configureStore({
    reducer: {
        user: UserReducer,
        page: PageReducer,
        openLayers: OpenLayersMapReducer,
        plantInfo: PlantInfoReducer,
        alertInfo: AlertInfoReducer,
        modalInfo: ModalInfoReducer,
        datasetTable: DatasetTableReducer,
        datasetTableView: DatasetTableViewReducer,
        internet: InternetReducer
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