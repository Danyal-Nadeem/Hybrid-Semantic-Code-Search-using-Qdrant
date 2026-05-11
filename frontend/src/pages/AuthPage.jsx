import { useState, useEffect, useRef } from 'react';
import Icons from '../components/Icons';

/* ─────────────────────── helpers ─────────────────────── */
const API = 'http://127.0.0.1:8000';

const AuthPage = ({ onLogin, onBackToLanding, initialIsLogin = true }) => {
  /* shared state */
  const [isLogin, setIsLogin]         = useState(initialIsLogin);
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [name, setName]               = useState('');
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordMinLength = 8;
  const passwordProgress = Math.min(password.length / passwordMinLength, 1);
  const isPasswordLongEnough = password.length >= passwordMinLength;

  /* signup verification step:  'form' | 'verify' */
  const [signupStep, setSignupStep]   = useState('form');

  /* OTP input (6 individual cells) */
  const [otp, setOtp]                 = useState(['', '', '', '', '', '']);
  const otpRefs                       = useRef([]);

  /* resend cooldown (seconds) */
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef                   = useRef(null);

  /* ── start countdown ── */
  const startCooldown = () => {
    setResendCooldown(60);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(cooldownRef.current), []);

  /* ── reset to login / signup form ── */
  const switchMode = (toLogin) => {
    setIsLogin(toLogin);
    setSignupStep('form');
    setOtp(['', '', '', '', '', '']);
    setError(null);
    setEmail(''); setPassword(''); setName('');
  };

  /* ── LOGIN ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const resp = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (resp.ok) onLogin(data.access_token, data.user_name, false);
      else setError(data.detail || 'Authentication failed');
    } catch { setError('Connection to server failed'); }
    finally { setLoading(false); }
  };

  /* ── SIGNUP step 1: send verification code ── */
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const resp = await fetch(`${API}/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setSignupStep('verify');
        setOtp(['', '', '', '', '', '']);
        startCooldown();
        setTimeout(() => otpRefs.current[0]?.focus(), 150);
      } else {
        setError(data.detail || 'Failed to send verification email');
      }
    } catch { setError('Connection to server failed'); }
    finally { setLoading(false); }
  };

  /* ── SIGNUP step 2: verify code ── */
  const handleVerifyCode = async (e) => {
    e?.preventDefault();
    const code = parseInt(otp.join(''), 10);
    if (otp.some(d => d === '') || isNaN(code)) {
      setError('Please enter the complete 6-digit code'); return;
    }
    setError(null); setLoading(true);
    try {
      const resp = await fetch(`${API}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await resp.json();
      if (resp.ok) onLogin(data.access_token, data.user_name, false);
      else setError(data.detail || 'Verification failed');
    } catch { setError('Connection to server failed'); }
    finally { setLoading(false); }
  };

  /* ── OTP cell change ── */
  const handleOtpChange = (idx, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
    /* auto-submit when all 6 filled */
    if (digit && idx === 5 && next.every(d => d !== '')) {
      setTimeout(() => handleVerifyCode(), 80);
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) setTimeout(() => handleVerifyCode(), 80);
  };

  /* ── resend ── */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null); setLoading(true);
    try {
      const resp = await fetch(`${API}/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await resp.json();
      if (resp.ok) { startCooldown(); setOtp(['', '', '', '', '', '']); otpRefs.current[0]?.focus(); }
      else setError(data.detail || 'Failed to resend');
    } catch { setError('Connection to server failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0f1a] overflow-hidden relative">
      {/* Header */}
      <header className="w-full z-50 bg-[#0b0f1a]/90 backdrop-blur-md border-b border-slate-800/50 pl-6 pr-8 py-3.5 flex items-center justify-between shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-200 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            >
              <span className="text-blue-400"><Icons.ArrowLeft /></span>
              Back
            </button>
          )}
          <div className="h-6 w-px bg-slate-800/70"></div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Icons.Shield size={22} />
          </div>
          <span className="text-white font-black text-xl tracking-tight">SCS <span className="text-blue-300">Pro</span></span>
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 bg-slate-800/60 border border-slate-700/50 rounded px-2 py-1 ml-1">Search</span>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-3">
          {isLogin ? (
            <button
              onClick={() => switchMode(false)}
              className="text-sm font-black px-5 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-blue-900/30 active:scale-95"
            >
              Sign up
            </button>
          ) : (
            <button
              onClick={() => switchMode(true)}
              className="text-sm font-black px-5 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-blue-900/30 active:scale-95"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Auth Body */}
      <div className="flex flex-1 md:flex-row overflow-hidden">
        {/* Left Hero Side */}
        <div className="hidden md:flex md:w-[55%] bg-[#0b0f1a] relative items-center justify-center p-12 overflow-hidden shadow-[20px_0_60px_rgba(0,0,0,0.4)]">
          {/* Base Gradient Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-950"></div>

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-grid-white opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>

          {/* Animated Background Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-800 opacity-10 blur-[120px] rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900 opacity-10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

          {/* Floating Decorative Elements */}
          <div className="absolute top-20 left-20 text-blue-300/20 animate-float opacity-40 blur-[1px]">
            <Icons.Code />
          </div>
          <div className="absolute bottom-24 right-32 text-indigo-900/20 animate-float-delayed opacity-40 blur-[1px]">
            <Icons.Globe />
          </div>

          {/* S-Shape Divider Overlay */}
          <div className="absolute top-0 right-0 h-full w-64 translate-x-1/2 z-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full fill-[#0b0f1a]">
              <path d="M0,0 C80,25 20,75 0,100 L100,100 L100,0 Z" />
            </svg>
          </div>

          <div className="relative z-30 space-y-12 flex flex-col items-center text-center max-w-lg animate-in fade-in slide-in-from-left-12 duration-1000">
            {/* Enhanced Glass Logo Box */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-900/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="w-32 h-32 glass-morphism rounded-[36px] flex items-center justify-center relative z-10 group-hover:scale-105 transition-all duration-500 border-white/10 group-hover:border-blue-700/30">
                <div className="text-blue-300 group-hover:text-blue-200 transition-colors duration-500">
                  <Icons.Shield size={72} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-7xl font-black tracking-tight text-white drop-shadow-2xl">
                SCS <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800 drop-shadow-none">Pro</span>
              </h1>
              <div className="space-y-3">
                <p className="text-2xl text-slate-300 font-light leading-snug tracking-tight">
                  <span className="text-white font-medium">Enterprise Codebase Search.</span>
                </p>
                <div className="h-1 w-12 bg-blue-700/50 mx-auto rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="flex-1 flex items-center justify-center bg-[#0b0f1a] p-4 relative z-10">
          <div className="w-full max-w-[340px] space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="bg-[#111827]/60 backdrop-blur-3xl rounded-[32px] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-slate-800/40">
              
              {/* ── VERIFY OTP step ── */}
              {!isLogin && signupStep === 'verify' ? (
                <>
                  <div className="space-y-1 mb-6 text-center">
                    <div className="w-12 h-12 bg-blue-900/40 border border-blue-700/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Icons.Mail size={24} className="text-blue-300" />
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight">Check your email</h2>
                    <p className="text-slate-500 text-[11px] font-semibold">
                      We sent a 6-digit code to<br />
                      <span className="text-blue-300 font-black">{email}</span>
                    </p>
                  </div>

                  {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-[12px] font-bold mb-4 text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleVerifyCode} className="space-y-5">
                    {/* OTP cells */}
                    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => otpRefs.current[idx] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          className="w-11 h-13 text-center text-xl font-black bg-slate-900/60 border border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:bg-slate-900 transition-all text-white caret-blue-400 shadow-inner"
                          style={{ height: '3.25rem' }}
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.some(d => d === '')}
                      className="w-full bg-blue-800 hover:bg-blue-700 disabled:opacity-40 text-white font-black py-3 rounded-xl transition-all shadow-[0_10px_20px_rgba(30,64,175,0.2)] active:scale-[0.97] text-xs uppercase tracking-[0.1em]"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Verifying...</span>
                        </div>
                      ) : 'Verify & Create Account'}
                    </button>
                  </form>

                  <div className="mt-5 flex flex-col items-center gap-2">
                    <button
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || loading}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 disabled:text-slate-600 transition-colors"
                    >
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                    </button>
                    <button
                      onClick={() => switchMode(false)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      ← Change email / details
                    </button>
                  </div>
                </>
              ) : (
                /* ── LOGIN or SIGNUP form step ── */
                <>
                  <div className="space-y-1 mb-6 text-center">
                    <h2 className="text-xl font-black text-white tracking-tight">
                      {isLogin ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.15em] opacity-80">
                      {isLogin ? 'Secure access' : 'Join the elite'}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-[12px] font-bold mb-6 text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={isLogin ? handleLogin : handleSendCode} className="space-y-3.5">
                    {!isLogin && (
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-black tracking-[0.1em] text-slate-500 ml-1">Full Name</label>
                        <div className="relative group">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-700 transition-colors"><Icons.User size={16} /></div>
                          <input
                            type="text" value={name} onChange={e => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all text-white text-sm font-semibold placeholder:text-slate-700 shadow-inner"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black tracking-[0.1em] text-slate-500 ml-1">Email</label>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-700 transition-colors"><Icons.Mail size={16} /></div>
                        <input
                          type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all text-white text-sm font-semibold placeholder:text-slate-700 shadow-inner"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-black tracking-[0.1em] text-slate-500 ml-1">Secure Key</label>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-700 transition-colors"><Icons.Lock size={16} /></div>
                        <input
                          type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-12 outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all text-white text-sm font-semibold placeholder:text-slate-700 shadow-inner"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors">
                          {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                        </button>
                      </div>
                      
                      {/* Password Strength Meter */}
                      {!isLogin && password.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500" aria-live="polite">
                            <span>Minimum {passwordMinLength} characters</span>
                            <span>{password.length}/{passwordMinLength}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-900/70 border border-slate-800">
                            <div
                              className={`h-full rounded-full transition-all ${isPasswordLongEnough ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{ width: `${passwordProgress * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="w-full bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all shadow-[0_10px_20px_rgba(30,64,175,0.2)] active:scale-[0.97] mt-4 text-xs uppercase tracking-[0.1em]"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>{isLogin ? 'Validating...' : 'Sending Code...'}</span>
                        </div>
                      ) : (isLogin ? 'Login' : 'Send Verification Code')}
                    </button>
                  </form>

                  <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
                    <p className="text-slate-500 text-[11px] font-bold">
                      {isLogin ? 'New to SCS?' : 'Already established?'}{' '}
                      <button onClick={() => switchMode(!isLogin)} className="text-blue-300 font-black hover:text-blue-200 transition-colors uppercase tracking-tight ml-1">
                        {isLogin ? 'Sign up' : 'Login'}
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
