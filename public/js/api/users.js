import { fetchData, createData, updateData, deleteData } from "./api.js";
import { API_URL } from '../utils/config.js';

const ENDPOINT = "users";

// Get all users
export function getUsers() {
    return fetchData(ENDPOINT);
}

// Create new user
export function createUser(user) {
    return createData(ENDPOINT, user);
}

// Update existing user
export function updateUser(id, user) {
    return updateData(ENDPOINT, id, user);
}

// Delete user by ID
export function deleteUser(id) {
    return deleteData(ENDPOINT, id);
}

// Authentication functions
export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function registerUser(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Logout failed');
        }
        
        return data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

export async function changePassword(email, currentPassword, newPassword) {
    try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Password change failed');
        }
        
        return data;
    } catch (error) {
        console.error('Password change error:', error);
        throw error;
    }
}