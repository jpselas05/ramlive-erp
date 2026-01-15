// pages/RedefinirSenhaPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const { redefinirSenha } = useAuth();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sessaoValida, setSessaoValida] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');


    if (type === 'recovery' && accessToken) {
      setSessaoValida(true);
      setVerificando(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessaoValida(true);
      } else {
        setErro('Link de recuperação inválido ou expirado');
      }
      setVerificando(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      await redefinirSenha(senha);
      alert('Senha redefinida com sucesso!');
      
      // Limpar sessão e redirecionar
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      setErro(error.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (verificando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center p-4">
        <div className="text-white text-lg">Verificando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Nova Senha</h1>
            <p className="text-gray-400">Defina sua nova senha</p>
          </div>

          {erro && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{erro}</p>
            </div>
          )}

          {sessaoValida ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Salvando...' : 'Redefinir Senha'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-400">
                O link de recuperação está inválido ou expirou.
              </p>
              <button
                onClick={() => navigate('/recuperar-senha')}
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Solicitar novo link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}