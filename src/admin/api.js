/**
 * Simple API helper for admin panel.
 * Automatically attaches the JWT token to requests.
 */

const API_BASE = '';

export function getToken() {
    return localStorage.getItem('portfolio_admin_token');
}

export function setToken(token) {
    localStorage.setItem('portfolio_admin_token', token);
}

export function removeToken() {
    localStorage.removeItem('portfolio_admin_token');
}

export function isLoggedIn() {
    return !!getToken();
}

export async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        ...(options.headers || {}),
    };

    // Don't set Content-Type for FormData — browser sets it with boundary
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}
