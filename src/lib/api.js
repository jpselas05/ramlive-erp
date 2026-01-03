import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 👉 Interceptor de REQUEST (coloca Bearer Token do Supabase)
api.interceptors.request.use(
    async (config) => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }

        // útil quando estiver usando ngrok
        config.headers['ngrok-skip-browser-warning'] = 'true';

        return config;
    },
    (error) => Promise.reject(error)
);

// 👉 Interceptor de RESPONSE (erros globais)
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (error.response?.status === 401) {
            await supabase.auth.signOut();
            window.location.href = '/login';
        }

        return Promise.reject({
            status: error.response?.status,
            message:
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Erro ao comunicar com o servidor',
            data: error.response?.data,
        });
    }
);

export default api;
