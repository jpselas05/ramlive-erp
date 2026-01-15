// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ImportacaoPage from './pages/ImportacaoPage';
import RelatoriosPage from './pages/RelatoriosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import UsersPage from './pages/UsersPage';
import RecuperarSenhaPage from './pages/RecuperarSenhaPage';
import RedefinirSenhaPage from './pages/RedefinirSenhaPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

          {/* Rotas protegidoas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/importacao"
            element={
              <ProtectedRoute>
                <ImportacaoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <ProtectedRoute>
                <RelatoriosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={

              <RequireRole roles={'admin'}>
                <ConfiguracoesPage />
              </RequireRole>
            }
          />

          {/* Rota apenas para Gerente */}
          <Route
            path="/usuarios"
            element={
              <RequireRole roles={'admin'}>
                <UsersPage />
              </RequireRole>
            }
          />

          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;