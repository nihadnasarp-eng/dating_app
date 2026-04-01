import React from 'react';
import { motion } from 'framer-motion';
// import { Heart, Shield, Zap, ArrowRight } from 'lucide-react';
const Heart = () => '❤️';
const Shield = () => '🛡️';
const Zap = () => '⚡';
const ArrowRight = () => '→';
import { useAuth } from '../context/AuthContext';

const Landing = ({ onNavigate }) => {
  const { login } = useAuth();

  const handleStart = () => {
    // Mock login for MVP
    const mockUser = {
      id: 'user_123',
      name: '',
      onboardingCompleted: false
    };
    login(mockUser);
    if (onNavigate) onNavigate('onboarding');
  };

  return (
    <div className="landing-container" style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 30%, #2A1B3D 0%, #0D0D12 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'var(--primary-glow)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.3,
          zIndex: 0
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 12, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '250px',
          height: '250px',
          background: 'var(--secondary-glow)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.2,
          zIndex: 0
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ zIndex: 1, position: 'relative' }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          width: '72px',
          height: '72px',
          borderRadius: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 32px rgba(255, 75, 107, 0.4)'
        }}>
          <Heart size={40} color="white" fill="white" />
        </div>

        <h1 className="gradient-text" style={{
          fontSize: '48px',
          fontWeight: 800,
          margin: '0 0 12px',
          letterSpacing: '-2px'
        }}>HeartSync</h1>
        
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '18px',
          maxWidth: '320px',
          margin: '0 auto 48px',
          lineHeight: '1.4'
        }}>
          Find authentic connections through AI-powered compatibility.
        </p>

        <div style={{ display: 'grid', gridGap: '16px', width: '100%', maxWidth: '340px', margin: '0 auto' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="btn-primary"
            style={{
              padding: '18px',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%'
            }}
          >
            Get Started <ArrowRight size={20} />
          </motion.button>

          <button style={{
            padding: '16px',
            color: 'var(--text)',
            fontSize: '16px',
            fontWeight: 500,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px'
          }}>
            Log In
          </button>
        </div>

        <div style={{
          marginTop: '64px',
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          opacity: 0.6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Shield size={16} /> Verified
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Zap size={16} /> Smart AI
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
