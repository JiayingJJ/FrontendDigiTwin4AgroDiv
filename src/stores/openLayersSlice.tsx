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
    selectedPropertiesFromDatabase: [];
    rendernGeoDataList: boolean;
    showUserDataLayer: boolean;
    addNewColumnsDataInGeometry: boolean;
    // save geo_data id und data_status
    selectedGeoInfo: null;
    userSelectedColor: string | null;
    feature: any;
    colorPicker: boolean;
    allInfoInProperties: [];
    getUpdateFromDatabase: boolean;
    files: [];
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
    rendernGeoDataList: false,
    showUserDataLayer: false,
    addNewColumnsDataInGeometry: false,
    selectedPropertiesFromDatabase: [],
    selectedGeoInfo: null,
    userSelectedColor: null,
    feature: null,
    colorPicker: false,
    allInfoInProperties: [],
    getUpdateFromDatabase: false,
    files: [],
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
        setSelectedPropertiesDataFromDatabase: (state, action) => {
            state.selectedPropertiesFromDatabase = action.payload;
        },
        setRendernGeoDataList: (state, action) => {
            state.rendernGeoDataList = action.payload;
        },
        clearReduxForGeoData: (state, action) => {
            state.columnInfo = null;
            state.rendernDataInfo = false;
            state.selectedGeoData = null;
            state.selectedGeoInfo = null;
            state.selectedGeometryDataFromDatabase = null;
            state.selectedPropertiesFromDatabase = [];
            state.feature = null;
            state.columnIdForDrawed = null;
            state.userSelectedColor = null;
            state.colorPicker = false;
            state.allInfoInProperties = [];
            state.files=[]
        },
        clearAllForGeoData: (state, action) => {
            state.columnInfo = null;
            state.rendernDataInfo = false;
            state.selectedGeoData = null;
            state.selectedGeometryDataFromDatabase = null;
            state.selectedPropertiesFromDatabase = [];
            state.addNewColumnsDataInGeometry = false;
            state.rendernGeoDataList = false;
            state.showUserDataLayer = false;
            state.selectedGeoInfo = null;
        },
        setShowUserDataLayer: (state, action) => {
            state.showUserDataLayer = action.payload;
        },
        setAddNewColumnsDataInGeometry: (state, action) => {
            state.addNewColumnsDataInGeometry = action.payload;
        },
        setSelectedGeoInfo: (state, action) => {
            state.selectedGeoInfo = action.payload;
        },
        setUserSelectedColor: (state, action) => {
            state.userSelectedColor = action.payload;
        },
        setFeature: (state, action) => {
            state.feature = action.payload;
        },
        setColorPicker: (state, action) => {
            state.colorPicker = action.payload;
        },
        setAllInfoInProperties: (state, action) => {
            state.allInfoInProperties = action.payload;
        },
        addAllInfoInProperties: (state, action) => {
            state.allInfoInProperties.push(action.payload);
        },
        setGetUpdateFromDatabase: (state, action) => {
            state.getUpdateFromDatabase = action.payload;
        },
        updateGeoDataAfterChange: (state, action) => {
            console.log(JSON.parse(JSON.stringify(action.payload)))
            state.geoData = action.payload.geoData;
        },
        setFiles: (state, action) => {
            state.files = action.payload.geoData;
        },
        addFiles: (state, action) => {
            state.files.push(action.payload);
        },
        clearFiles: (state, action) => {
            state.files=[]
        }
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
    setRendernGeoDataList,
    clearReduxForGeoData,
    setShowUserDataLayer,
    setSelectedPropertiesDataFromDatabase,
    setAddNewColumnsDataInGeometry,
    setSelectedGeoInfo,
    setUserSelectedColor,
    setColorPicker,
    setAllInfoInProperties,
    addAllInfoInProperties
} = openLayersSlice.actions;

export default openLayersSlice.reducer;