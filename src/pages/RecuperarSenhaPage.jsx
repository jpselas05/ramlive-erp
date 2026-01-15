import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RecuperarSenhaPage() {
    const { recuperarSenha } = useAuth()
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    const [erro, setErro] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);
        setMensagem(null);

        try {
            await recuperarSenha(email)
            setMensagem('Um email com instruções foi enviado para seu endereço. Verifique sua caixa de entrada.');
            setEmail('');
        } catch (error) {
            setErro(error.message || 'Erro ao enviar email de recuperação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Recuperar Senha</h1>
                        <p className="text-gray-400">
                            Digite seu email para receber as instruções
                        </p>
                    </div>

                    {mensagem && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                            <p className="text-emerald-400 text-sm">{mensagem}</p>
                        </div>
                    )}

                    {erro && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p className="text-red-400 text-sm">{erro}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            {loading ? 'Enviando...' : 'Enviar Email'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                        >
                            ← Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}