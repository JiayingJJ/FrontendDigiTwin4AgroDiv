import { createSlice } from '@reduxjs/toolkit';

interface ProjectsState {
    allProjects: [];
    selectedProject: any;
    addNewProject: boolean;
    editProject: boolean;
    userTablesForProject: [] | null;
    selectedUserTable: [] | null;
    getUpdateFromDatabase: boolean;
    selectedProjectId: string | null;
    addMember: boolean;

}

const initialState: ProjectsState = {
    allProjects: [],
    selectedProject: null,
    addNewProject: false,
    userTablesForProject: null,
    selectedUserTable: null,
    editProject: false,
    getUpdateFromDatabase: false,
    selectedProjectId: null,
    addMember: false,
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
        setEditProject: (state, action) => {
            state.editProject = action.payload;
        },
        clearProjectState: (state, action) => {
            state.allProjects = [],
                state.selectedProject = null,
                state.addNewProject = false
        },
        setUserTablesForProject: (state, action) => {
            state.userTablesForProject = action.payload;
        },
        setSelectedUserTable: (state, action) => {
            state.selectedUserTable = action.payload;
        },
        setGetUpdateFromDatabase: (state, action) => {
            state.getUpdateFromDatabase = action.payload;
        },
        setSelectedProjectId: (state, action) => {
            state.selectedProjectId = action.payload;
        },
        setAddMember: (state, action) => {
            state.addMember = action.payload;
        },
    }
});

export const {
    setAllProjects,
    setSelectedProject,
    setAddNewProject,
    clearProjectState,
    setUserTablesForProject,
    setSelectedUserTable,
    setEditProject
} = projectsSlice.actions;

export default projectsSlice.reducer;