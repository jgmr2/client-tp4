import { removeToken } from './AuthProvider'; // ✅ Importa la función

const BASE_URL = 'http://localhost:3001';

const request = async (endpoint, method = 'GET', body = null, isAuthRequest = false) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(isAuthRequest && token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (response.status === 403 || response.status === 401) {
            removeToken();
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || 'Something went wrong');
        }

        const contentType = response.headers.get('content-type');
        return contentType && contentType.includes('application/json') 
            ? await response.json()
            : null;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Funciones de autenticación
const login = (username, password) => {
    return request('/login', 'POST', { username, password }, true);
};

const register = (username, password) => {
    return request('/register', 'POST', { username, password }, true);
};

const getGames = () => request('/games'); // Obtener todas las partidas

const createGame = () => request('/games', 'POST'); // Crear una nueva partida

const joinGame = (gameId) => request(`/games/${gameId}/join`, 'POST'); // Unirse a una partida

const getGameState = (gameId) => request(`/games/${gameId}`); // Obtener estado de la partida

export { request, login, register, getGames, createGame, joinGame, getGameState };


