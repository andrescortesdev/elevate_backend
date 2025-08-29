import { fetchData, createData, updateData, deleteData } from "./api.js";
import { API_URL } from '../utils/config.js';

const ENDPOINT = "candidates";

// Get all candidates
export function getCandidates() {
    return fetchData(ENDPOINT);
}

// Create new candidate
export function createCandidate(candidate) {
    return createData(ENDPOINT, candidate);
}

// Update existing candidate
export function updateCandidate(id, candidate) {
    return updateData(ENDPOINT, id, candidate);
}

// Delete candidate by ID
export function deleteCandidate(id) {
    return deleteData(ENDPOINT, id);
}

// Get candidate notes by ID
export function getCandidateNotes(id) {
    return fetchData(`${ENDPOINT}/${id}/notes`);
}

// Update candidate notes by ID
export async function updateCandidateNotes(id, notes) {
    const response = await fetch(`${API_URL}/${ENDPOINT}/${id}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
    });
    if (!response.ok) throw new Error(`Error updating notes: ${response.status}`);
    return response.json();
}