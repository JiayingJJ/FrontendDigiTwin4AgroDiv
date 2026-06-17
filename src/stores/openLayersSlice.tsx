import { createSlice } from '@reduxjs/toolkit';

interface OpenLayersState {
    layerType: string | null;
    drawingInteraction: boolean;
    addDrawedInteractionInfo: boolean;
    geometry: [] | null;
    geometryType: string | null;
    tableIdForDrawed: string | null;
    columnIdForDrawed: string | null;
    rendernDataInfo: boolean;
    columnInfo: any | null;
    tableInfo: any | null;
    geoData: [];
    geoJsonData: [];
    selectedGeoData: string | null;
    selectedGeometryDataFromDatabase: null;
    geoDataWithSameGeometry: [];
    rendernGeoDataList: boolean;
}

const initialState: OpenLayersState = {
    layerType: 'standard',
    drawingInteraction: false,
    addDrawedInteractionInfo: false,
    geometry: null,
    geometryType: null,
    tableIdForDrawed: null,
    columnIdForDrawed: null,
    rendernDataInfo: false,
    columnInfo: null,
    tableInfo: null,
    geoData: [],
    geoJsonData: [],
    selectedGeoData: null,
    selectedGeometryDataFromDatabase: null,
    geoDataWithSameGeometry: [],
    rendernGeoDataList: false,
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
        },
        setTableIdForDrawed: (state, action) => {
            state.tableIdForDrawed = action.payload;
        },
        clearTableIdForDrawed: (state, action) => {
            state.tableIdForDrawed = null;
        },
        setColumnIdForDrawed: (state, action) => {
            state.columnIdForDrawed = action.payload;
        },
        clearColumnIdForDrawed: (state, action) => {
            state.columnIdForDrawed = null;
        },
        setRendernDataInfo: (state, action) => {
            state.rendernDataInfo = action.payload;
        },
        setColumnInfo: (state, action) => {
            state.columnInfo = action.payload;
        },
        setTableInfo: (state, action) => {
            state.tableInfo = action.payload;
        },
        setGeodata: (state, action) => {
            state.geoData = action.payload;
        },
        setGeoJsonData: (state, action) => {
            state.geoJsonData = action.payload;
        },
        setSelectedGeoData: (state, action) => {
            state.selectedGeoData = action.payload;
        },
        setSelectedGeometryDataFromDatabase: (state, action) => {
            state.selectedGeometryDataFromDatabase = action.payload;
        },
        setGeoDataWithSameGeometry: (state, action) => {
            state.geoDataWithSameGeometry = action.payload;
        },
        addGeoDataWithSameGeometry: (state, action) => {
            state.geoDataWithSameGeometry.push(action.payload);
        },
        setRendernGeoDataList: (state, action) => {
            state.rendernGeoDataList = action.payload;
        },
    }
});

export const {
    setLayerType,
    setDrawingInteraction,
    setAddDrawedInteractionInfo,
    setGeometry,
    setGeometryType,
    setTableIdForDrawed,
    clearTableIdForDrawed,
    setColumnIdForDrawed,
    clearColumnIdForDrawed,
    setRendernDataInfo,
    setColumnInfo,
    setTableInfo,
    setGeodata,
    setGeoJsonData,
    setSelectedGeoData,
    setSelectedGeometryDataFromDatabase,
    setGeoDataWithSameGeometry,
    addGeoDataWithSameGeometry,
    setRendernGeoDataList
} = openLayersSlice.actions;

export default openLayersSlice.reducer;