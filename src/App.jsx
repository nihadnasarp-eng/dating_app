import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- API CLIENT ---
const API_URL = 'http://localhost:5000/api';

// --- AUTH CONTEXT ---
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(false);

  const signup = async (username, password, gender) => {
    const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, gender })
    });
    if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return null;
    }
    const err = await res.json();
    return err.error;
  };

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return null;
    }
    const err = await res.json();
    return err.error;
  };

  const logout = () => {
      setUser(null);
      localStorage.removeItem('user');
  };

  const updateProfile = async (updates) => {
    // Basic local state update for MVP
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile }}>{children}</AuthContext.Provider>;
};
const useAuth = () => useContext(AuthContext);

// --- UI COMPONENTS ---
const Button = ({ children, onClick, variant = 'primary', style = {}, disabled = false }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={!disabled ? onClick : null}
    disabled={disabled}
    style={{
      background: variant === 'primary' ? 'linear-gradient(135deg, #FF4B6B, #FF7B93)' : '#1A1A24',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 600,
      border: variant === 'primary' ? 'none' : '1px solid rgba(255,255,255,0.1)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: '100%',
      opacity: disabled ? 0.5 : 1,
      ...style
    }}
  >
    {children}
  </motion.button>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: '20px', textAlign: 'left' }}>
    <label style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '8px', display: 'block' }}>{label}</label>
    <input
      {...props}
      style={{
        width: '100%',
        background: '#1A1A24',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '14px',
        borderRadius: '10px',
        color: 'white',
        fontSize: '16px'
      }}
    />
  </div>
);

// --- SCREENS ---
const Landing = ({ onEnter }) => (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 30%, #2A1B3D 0%, #0D0D12 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ background: '#FF4B6B', width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>❤️</div>
      <h1 style={{ fontSize: '48px', color: 'white', background: 'linear-gradient(135deg, #FF4B6B, #6C63FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 16px' }}>Tetramatch</h1>
      <p style={{ color: '#94A3B8', marginBottom: '48px', maxWidth: '280px' }}>Join the community of authentic hearts.</p>
      <Button onClick={onEnter} style={{ maxWidth: '300px' }}>Enter Tetramatch</Button>
    </div>
);

const AuthScreen = ({ onNext }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', gender: 'female' });
  const [error, setError] = useState('');
  const { signup, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!form.username || !form.password) { setError("Fill all fields"); return; }
    setLoading(true);
    const err = isLogin ? await login(form.username, form.password) : await signup(form.username, form.password, form.gender);
    if (err) { setError(err); setLoading(false); } else onNext();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D12', padding: '40px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 style={{ fontSize: '32px', color: 'white', marginBottom: '8px' }}>{isLogin ? 'Welcome Back' : 'Join Tetramatch'}</h2>
      <p style={{ color: '#94A3B8', marginBottom: '32px' }}>{isLogin ? 'Enter your credentials' : 'Create a unique identity'}</p>
      
      <Input label="Username" placeholder="e.g. helloworld" value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase().trim()})} />
      <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
      
      {!isLogin && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '12px', display: 'block' }}>I am a...</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['female', 'male'].map(g => (
              <button key={g} onClick={() => setForm({...form, gender: g})} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: form.gender === g ? '#FF4B6B' : '#1A1A24', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textTransform: 'capitalize' }}>{g}</button>
            ))}
          </div>
        </div>
      )}

      {error && <p style={{ color: '#EF4444', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
      
      <Button disabled={loading} onClick={handle}>{loading ? 'Progressing...' : (isLogin ? 'Login' : 'Sign Up')}</Button>
      
      <p style={{ color: '#94A3B8', marginTop: '24px', textAlign: 'center' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#FF4B6B', marginLeft: '8px', cursor: 'pointer' }}>{isLogin ? 'Sign Up' : 'Login'}</span>
      </p>
    </div>
  );
};

const Discovery = ({ onGoToChats }) => {
  const { user, updateProfile } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await fetch(`${API_URL}/profiles?gender=${user.gender}&id=${user.id}`);
      const data = await res.json();
      setProfiles(data || []);
      setLoading(false);
    };
    if (user) fetchProfiles();
  }, [user]);

  const currentProfile = profiles[idx % profiles.length];
  const hasProfiles = user.gender === 'female' || (user.profiles_viewed || 0) < (user.profiles_limit || 20);

  const handleAction = async (type) => {
    await fetch(`${API_URL}/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_user: user.id, to_user: currentProfile?.id, type })
    });
    if (type === 'like') {
        alert(`Match! You can now chat anonymously with ${currentProfile?.username}.`);
    }
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    updateProfile({ profiles_viewed: (user.profiles_viewed || 0) + 1 });
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Searching for hearts in MySQL...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D12', padding: '24px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
        <h2 style={{ color: 'white' }}>Tetramatch</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={onGoToChats} style={{ color: '#FF4B6B', fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Chats</button>
            <div style={{ background: '#1A1A24', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', color: '#B0B0B0' }}>
                {user.gender === 'male' ? `${Math.max(0, (user.profiles_limit || 20) - (user.profiles_viewed || 0))} left` : 'Unlimited'}
            </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!currentProfile ? (
          <div style={{ color: '#94A3B8', textAlign: 'center', marginTop: '100px' }}>No matches found in your area yet.</div>
        ) : hasProfiles ? (
          <motion.div key={currentProfile.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ position: 'relative', height: '550px', borderRadius: '24px', overflow: 'hidden' }}>
            <img src={currentProfile.img_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=600'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                <h3 style={{ color: 'white', fontSize: '24px' }}>{currentProfile.username}</h3>
                <p style={{ color: '#D0D0D0' }}>{currentProfile.bio || 'New on Tetramatch!'}</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                   <Button onClick={() => handleAction('pass')} variant="secondary" style={{ flex: 1 }}>Pass</Button>
                   <Button onClick={() => handleAction('like')} style={{ flex: 1 }}>Like</Button>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#1A1A24', borderRadius: '24px', padding: '32px' }}>
             <h3 style={{ color: 'white', marginBottom: '12px' }}>No More Profiles!</h3>
             <p style={{ color: '#94A3B8', marginBottom: '32px' }}>Upgrade now to see 20 more people in your area.</p>
             <Button onClick={() => updateProfile({ profiles_limit: (user.profiles_limit || 20) + 20 })}>Get 20 more (40 INR)</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Chats = ({ onBack }) => {
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            const res = await fetch(`${API_URL}/matches?userId=${user.id}`);
            const data = await res.json();
            setMatches(data || []);
        };
        if (user) fetchMatches();
    }, [user]);

    return (
        <div style={{ minHeight: '100vh', background: '#0D0D12', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={onBack} style={{ color: '#FF4B6B', fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
                <h2 style={{ color: 'white' }}>Anonymous Chats</h2>
            </div>
            
            {matches.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '100px', color: '#94A3B8' }}>No matches yet. Start swiping!</div>
            ) : (
                <div style={{ display: 'grid', gridGap: '16px' }}>
                    {matches.map((p) => (
                        <div key={p.id} style={{ background: '#1A1A24', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#333', overflow: 'hidden' }}>
                                    <img src={p.img_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=48'} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(4px)' }} />
                                </div>
                                <div>
                                    <h4 style={{ color: 'white', margin: 0 }}>{p.username}</h4>
                                    <p style={{ color: '#94A3B8', fontSize: '12px' }}>Chatting anonymously...</p>
                                </div>
                            </div>
                            <Button onClick={() => alert(`Contact shared! Reach ${p.username} at: ${p.contact_info || 'Not shared'}`)} variant="secondary" style={{ width: 'auto', padding: '8px 16px', fontSize: '12px' }}>Share</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const AppContent = ({ screen, setScreen }) => {
    const { user, loading } = useAuth();
    
    useEffect(() => {
        if (user && (screen === 'auth' || screen === 'landing')) setScreen('discovery');
    }, [user, screen, setScreen]);

    if (loading) return <div style={{ minHeight: '100vh', background: '#0D0D12', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Connecting to Tetramatch...</div>;

    if (screen === 'landing') return <Landing onEnter={() => setScreen('auth')} />;
    if (screen === 'auth') return <AuthScreen onNext={() => setScreen('discovery')} />;
    if (screen === 'discovery') return <Discovery onGoToChats={() => setScreen('chats')} />;
    if (screen === 'chats') return <Chats onBack={() => setScreen('discovery')} />;
    
    return null;
}

function App() {
  const [screen, setScreen] = useState('landing');
  return (
    <AuthProvider>
      <AppContent screen={screen} setScreen={setScreen} />
    </AuthProvider>
  );
}

export default App;
