import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import { User } from './services/api';
import { Moon, Sun } from 'lucide-react';

export type AuthData = {
  token: string;
  user: User;
};

function App() {
  const navigate = useNavigate();

  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [auth, setAuth] = useState<AuthData | null>(() => {
    const stored = localStorage.getItem('authUser');
    return stored ? (JSON.parse(stored) as AuthData) : null;
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('authUser');
      setAuth(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    setAuth(null);
    navigate('/');
  };

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <>
      <div className='min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100'>
        <header className='border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur sticky top-0 z-10'>
          <div className='container flex items-center justify-between py-4'>
            <div>
              <Link to='/' className='font-semibold text-lg'>
                Venda Ingressos
              </Link>
            </div>

            <nav className='flex items-center gap-4 text-sm'>
              <Link to='/' className='hover:underline'>
                Eventos
              </Link>
              {/* <Link to="/admin" className="hover:underline">Admin</Link>
            <Link to="/admin/login" className="hover:underline">Login Admin</Link> */}

              {!auth && (
                <Link to='/organizador/login' className='btn btn-primary'>
                  Login
                </Link>
              )}
              {/* Área de usuário logado */}
              {auth && (
                <>
                  <Link to='/cliente/painel' className='flex items-center'>
                    <div className='ml-4 flex items-center gap-2'>
                      <span className='inline-block h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700 text-center text-xs font-bold'>
                        {auth?.user?.name?.charAt(0).toUpperCase()}
                      </span>
                      <span className='font-medium'>{auth?.user?.name}</span>
                    </div>
                  </Link>
                  <button className='text-xs underline' onClick={logout}>
                    Sair
                  </button>
                </>
              )}

              {dark ? (
                <Sun size={14} style={{cursor: 'pointer'}} onClick={() => setDark((v) => !v)} />
              ) : (
                <Moon size={14} style={{cursor: 'pointer'}} onClick={() => setDark((v) => !v)} />
              )}
            </nav>
          </div>
        </header>
        <main className='container py-6'>
          <Outlet context={{ auth, setAuth }} />
        </main>
        <footer className='border-t py-6 text-center text-sm opacity-70'>
          © {new Date().getFullYear()} Venda Ingressos
        </footer>
      </div>
    </>
  );
}

export default App;
