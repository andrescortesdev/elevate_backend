import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "roles";

// Get all roles
export function getRoles() {
    return fetchData(ENDPOINT);
}

// Create new role
export function createRole(role) {
    return createData(ENDPOINT, role);
}

// Update existing role
export function updateRole(id, role) {
    return updateData(ENDPOINT, id, role);
}

// Delete role by ID
export function deleteRole(id) {
    return deleteData(ENDPOINT, id);
}