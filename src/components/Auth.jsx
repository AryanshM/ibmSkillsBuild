import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Auth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 🔍 Check session when component loads
  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };
    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ Redirect once user is available
  useEffect(() => {
    if (!loading && user) {
      console.log('User signed in → redirecting');
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email for confirmation link!');
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  // 🕓 Wait for Supabase to finish checking session
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-text-secondary">
        Checking session...
      </div>
    );
  }

  // 🧭 If user exists, nothing will render because redirect happens
  if (user) return null;

  // ✉️ Auth form
  return (
    <div className="max-w-sm mx-auto p-6 card">
      <h2 className="text-xl font-bold mb-4 text-center">Login / Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        className="input mb-3 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="input mb-3 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <button onClick={handleSignIn} className="btn w-full">
          Sign In
        </button>
        <button onClick={handleSignUp} className="btn-outline w-full">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Auth;
