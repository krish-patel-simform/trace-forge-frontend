import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Activity } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      const { user, accessToken, refreshToken } = res.data.data;
      login(accessToken, refreshToken, user);
      navigate('/projects');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-500/30">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              TraceForge
            </span>
          </div>
        </div>
        
        <Card glass className="p-8">
          <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Get started with website analytics</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Name" 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input 
              label="Email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {error && <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>}
            
            <Button type="submit" className="w-full mt-2" isLoading={loading}>
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">Sign in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
