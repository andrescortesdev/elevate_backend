import { fetchData, createData, updateData } from "./api.js";

const ENDPOINT = "aicv";

// Get all AI CV applications
export function getApplications() {
    return fetchData(ENDPOINT);
}

// Create new AI CV application
export function createApplication(application) {
    return createData(ENDPOINT, application);
}

// Update existing AI CV application
export function updateApplication(id, application) {
    return updateData(ENDPOINT, id, application);
}