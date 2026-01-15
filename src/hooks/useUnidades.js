import { useState, useEffect } from 'react';
import { getUnidades } from '../api/endpoints';

export function useUnidades() {
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarUnidades();
  }, []);

  async function carregarUnidades() {
    try {
      setLoading(true);
      const data = await getUnidades();
      setUnidades(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar unidades:', err);
    } finally {
      setLoading(false);
    }
  }

  return { unidades, loading, error, refetch: carregarUnidades };
}