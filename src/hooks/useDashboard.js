import { useState, useEffect } from 'react';
import { getDashboard } from '../lib/endpoints';

export function useDashboard(unidadeId, ano, mes) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (unidadeId) {
            carregarDados();
        }
    }, [unidadeId, ano, mes]);

    async function carregarDados() {
        try {
            if (unidadeId) {
                setLoading(true);
                const dashboardData = await getDashboard(unidadeId, ano, mes);
                setData(dashboardData);
                setError(null);
            }
            else {setLoading(true)}
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar dashboard:', err);
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, refetch: carregarDados };
}