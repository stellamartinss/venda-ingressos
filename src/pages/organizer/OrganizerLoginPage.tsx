import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { api } from '../../services/api';
import { AuthData } from '../../App';

export type AuthContextType = {
    auth: AuthData;
    setAuth: React.Dispatch<React.SetStateAction<AuthData>>;
  };

function OrganizerLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useOutletContext<AuthContextType>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login({ email, password });

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));

      setAuth(response);

      if (response.user.role === 'ORGANIZER') {
        navigate('/organizador/painel');
        return;
      }

      navigate('/cliente/painel');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-2xl font-semibold mb-4'>Login</h1>
      <form onSubmit={onSubmit} className='space-y-3'>
        {error && <div className='text-red-600 text-sm'>{error}</div>}
        <input
          required
          type='email'
          placeholder='E-mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900'
        />
        <input
          required
          type='password'
          placeholder='Senha'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900'
        />
        <button
          disabled={loading}
          className='w-full px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50'
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className='text-sm mt-3'>
        Não tem conta?{' '}
        <Link to='/organizador/cadastro' className='underline'>
          Cadastrar
        </Link>
      </p>
      <div className='right-0 mt-2 text-right'>
        <small className='text-gray-400'>
          <Link to='/admin/login' className='hover:underline'>
            Login Admin
          </Link>
        </small>
      </div>
    </div>
  );
}

export default OrganizerLoginPage;
