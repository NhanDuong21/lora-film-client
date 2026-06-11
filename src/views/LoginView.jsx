import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ShieldAlert, ArrowLeft, Loader2, Shield, Briefcase, User, Eye, EyeOff } from 'lucide-react';

export default function LoginView({ onBack, onRegisterLink, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Input Validation
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu đăng nhập phải có ít nhất 6 ký tự!');
      return;
    }

    setIsSubmitting(true);
    // Simulate minor network delay
    setTimeout(() => {
      const res = login(email, password);
      setIsSubmitting(false);
      if (res.success) {
        onSuccess(res.user);
      } else {
        setErrorMsg(res.message);
      }
    }, 600);
  };

  const handleFastFill = (roleType) => {
    let fillEmail = '';
    let fillPass = '123456';

    if (roleType === 'ADMIN') {
      fillEmail = 'admin@lorafilm.com';
    } else if (roleType === 'EMPLOYEE' || roleType === 'STAFF') {
      fillEmail = 'staff@lorafilm.com';
    } else if (roleType === 'ACCOUNTANT') {
      fillEmail = 'finance@lorafilm.com';
    } else if (roleType === 'SUPERVISOR') {
      fillEmail = 'supervisor@lorafilm.com';
      fillPass = 'password123';
    } else {
      fillEmail = 'member@gmail.com';
    }

    setEmail(fillEmail);
    setPassword(fillPass);
    setErrorMsg('');

    setIsSubmitting(true);
    setTimeout(() => {
      const res = login(fillEmail, fillPass);
      setIsSubmitting(false);
      if (res.success) {
        onSuccess(res.user);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center py-16 px-6 relative overflow-hidden select-none">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-coral/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-yellow/5 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Main card box */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 animate-fade-in relative z-10">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-brand-coral transition-colors mb-6 text-sm font-semibold focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ</span>
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black tracking-wider uppercase text-white">ĐĂNG NHẬP</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Truy cập tài khoản LoraFilm</p>
        </div>

        {/* Error notification bar */}
        {errorMsg && (
          <div className="mb-6 bg-red-950/50 border border-red-800/80 rounded-xl p-4 flex items-start gap-3 text-red-200 text-xs leading-relaxed animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Địa chỉ Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@lorafilm.com"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl pl-11 pr-10 py-3 text-sm text-zinc-100 transition-colors placeholder:text-zinc-600 outline-none"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl pl-11 pr-10 py-3 text-sm text-zinc-100 transition-colors placeholder:text-zinc-650 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:opacity-95 text-zinc-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 font-sans uppercase tracking-widest mt-6 block text-center cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>ĐANG KIỂM TRA...</span>
              </div>
            ) : (
              <span>XÁC NHẬN ĐĂNG NHẬP</span>
            )}
          </button>
        </form>

        {/* Register Redirection Link */}
        <div className="text-center mt-6 text-xs text-zinc-400">
          Chưa có tài khoản LoraFilm?{' '}
          <span
            onClick={onRegisterLink}
            className="text-orange-400 hover:underline cursor-pointer font-medium"
          >
            Đăng ký thành viên ngay
          </span>
        </div>

        {/* Divider */}
        <div className="text-center text-[10px] font-mono font-bold tracking-widest text-zinc-600 uppercase flex items-center gap-4 my-6 before:content-[''] before:flex-1 before:h-[1px] before:bg-zinc-800/60 after:content-[''] after:flex-1 after:h-[1px] after:bg-zinc-800/60">
          DEMO FAST-FILL ACCOUNTS
        </div>

        {/* Demo Fast-Fill helper pills grid */}
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={() => handleFastFill('ADMIN')}
            className="w-full text-left border border-red-950/40 bg-red-950/10 hover:bg-red-950/20 text-red-400 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-red-400 shrink-0" />
              <span>Đăng nhập nhanh Admin</span>
            </div>
            <span className="text-[10px] uppercase font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
              ADMIN
            </span>
          </button>
          
          <button
            onClick={() => handleFastFill('STAFF')}
            className="w-full text-left border border-amber-950/40 bg-amber-950/10 hover:bg-amber-950/20 text-amber-400 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-amber-400 shrink-0" />
              <span>Đăng nhập nhanh Nhân viên</span>
            </div>
            <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              STAFF
            </span>
          </button>

          <button
            onClick={() => handleFastFill('SUPERVISOR')}
            className="w-full text-left border border-purple-950/40 bg-purple-950/10 hover:bg-purple-950/20 text-purple-400 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-purple-400 shrink-0" />
              <span>Đăng nhập nhanh Giám sát</span>
            </div>
            <span className="text-[10px] uppercase font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
              SUPERVISOR
            </span>
          </button>

          <button
            onClick={() => handleFastFill('ACCOUNTANT')}
            className="w-full text-left border border-orange-950/40 bg-orange-950/10 hover:bg-orange-950/20 text-orange-400 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-orange-400 shrink-0" />
              <span>Đăng nhập nhanh Kế toán</span>
            </div>
            <span className="text-[10px] uppercase font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
              ACCOUNTANT
            </span>
          </button>
          
          <button
            onClick={() => handleFastFill('CUSTOMER')}
            className="w-full text-left border border-emerald-950/40 bg-emerald-950/10 hover:bg-emerald-950/20 text-emerald-400 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span>Đăng nhập nhanh Khách hàng</span>
            </div>
            <span className="text-[10px] uppercase font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              MEMBER
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
