import { createSlice } from '@reduxjs/toolkit';

interface ProjectsState {
    allProjects: [];
    selectedProject: any;
    addNewProject: boolean;
    userTablesForProject: []|null;
}

const initialState: ProjectsState = {
    allProjects: [],
    selectedProject: null,
    addNewProject: false,
    userTablesForProject: null,
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
    }
});

export const {
    setAllProjects,
    setSelectedProject,
    setAddNewProject,
    clearProjectState,
    setUserTablesForProject
} = projectsSlice.actions;

export default projectsSlice.reducer;