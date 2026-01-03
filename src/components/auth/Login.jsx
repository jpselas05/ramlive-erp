import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/ramlive.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' ou 'signup'

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        await signIn(email, password);
        navigate('/');

    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1E1E] via-[#1E3A5F] to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-30 h-30 mx-auto mb-4 flex items-center justify-center">
            <img
              src={logo}
              alt="Ramlive"
              className="w-50 h-50 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1E1E1E] rounded-2xl p-8 shadow-2xl border border-[#2A2A2A]">

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#468EE5] transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-[#2A2A2A] rounded-lg pl-10 pr-12 py-3 text-white focus:outline-none focus:border-[#468EE5] transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Mensagem */}
            {error && (
              <div
                className={`p-3 rounded-lg text-sm border ${error.startsWith('✅')
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}
              >
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#468EE5] to-[#1E3A5F] hover:from-[#3A78C2] hover:to-[#162C45] text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          {/* Esqueci senha */}
          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button className="text-sm text-gray-400 hover:text-[#468EE5] transition-colors">
                Esqueci minha senha
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Adonel. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
