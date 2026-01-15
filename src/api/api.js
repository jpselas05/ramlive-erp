// api.js - VERSÃO SEGURA
import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Interceptor de REQUEST
api.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }

        config.headers['ngrok-skip-browser-warning'] = 'true';

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Interceptor de RESPONSE
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        // Se receber 401 (não autorizado), fazer logout
        if (error.response?.status === 401) {
            await supabase.auth.signOut();

            const basename = import.meta.env.BASE_URL || '/';
            const loginPath = basename.endsWith('/')
                ? `${basename}login`
                : `${basename}/login`;

            window.location.href = loginPath;
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