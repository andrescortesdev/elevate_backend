import { API_URL } from '../utils/config.js';

// GET (read data)
export async function fetchData(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`Error fetching data: ${res.status}`);
    return res.json();
}

// POST (create)
export async function createData(endpoint, data) {
    const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error creating record: ${res.status}`);
    return res.json();
}

// PUT (update)
export async function updateData(endpoint, id, data) {
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error updating record: ${res.status}`);
    return res.json();
}

// DELETE (delete)
export async function deleteData(endpoint, id) {
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error deleting record: ${res.status}`);
    return true;
}
