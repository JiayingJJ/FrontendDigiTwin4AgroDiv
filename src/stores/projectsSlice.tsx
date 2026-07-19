import { createSlice } from '@reduxjs/toolkit';

interface ProjectsState {
    allProjects: [];
    selectedProject: any;
    addNewProject: boolean;
    userTablesForProject: []|null;
    selectedUserTables: []|null;
}

const initialState: ProjectsState = {
    allProjects: [],
    selectedProject: null,
    addNewProject: false,
    userTablesForProject: null,
    selectedUserTables: null,
}

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setAllProjects: (state, action) => {
            state.allProjects = action.payload;
        },
        setSelectedProject: (state, action) => {
            state.selectedProject = action.payload;
        },
        setAddNewProject: (state, action) => {
            state.addNewProject = action.payload;
        },
        clearProjectState: (state, action) => {
            state.allProjects = [],
            state.selectedProject = null,
            state.addNewProject = false
        },
        setUserTablesForProject: (state, action) => {
            state.userTablesForProject = action.payload;
        },
        setSelectedUserTables: (state, action) => {
            state.selectedUserTables = action.payload;
        },
    }
});

export const {
    setAllProjects,
    setSelectedProject,
    setAddNewProject,
    clearProjectState,
    setUserTablesForProject,
    setSelectedUserTables
} = projectsSlice.actions;

export default projectsSlice.reducer;