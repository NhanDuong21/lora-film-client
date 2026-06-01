import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, ShieldAlert, ArrowLeft, Loader2, Shield, Briefcase, User } from 'lucide-react';

export default function LoginView({ onBack, onRegisterLink, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    const fillPass = '123456';

    if (roleType === 'ADMIN') fillEmail = 'admin@lorafilm.com';
    else if (roleType === 'EMPLOYEE') fillEmail = 'staff@lorafilm.com';
    else fillEmail = 'member@gmail.com';

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
    <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center py-16 px-6 relative overflow-hidden">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-coral/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-yellow/5 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Main card box */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 relative z-10 shadow-2xl">
        {/* Back Link */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-brand-coral transition-colors mb-6 text-sm font-semibold"
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
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@lorafilm.com"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-brand-coral rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-brand-coral rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-coral hover:bg-opacity-90 disabled:bg-zinc-800 text-white font-black py-3.5 rounded-xl shadow-lg shadow-brand-coral/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              <span>Xác nhận Đăng Nhập</span>
            )}
          </button>
        </form>

        {/* Register Redirection Link */}
        <div className="text-center mt-6 text-xs text-zinc-400">
          Chưa có tài khoản LoraFilm?{' '}
          <button
            onClick={onRegisterLink}
            className="text-brand-coral font-bold hover:underline focus:outline-none"
          >
            Đăng ký thành viên ngay
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <span className="relative bg-zinc-900 px-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            DEMO FAST-FILL ACCOUNTS
          </span>
        </div>

        {/* Demo Fast-Fill helper pills grid */}
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={() => handleFastFill('ADMIN')}
            className="w-full text-left bg-rose-950/30 border border-rose-900/60 hover:bg-rose-900/30 text-rose-300 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-rose-400 shrink-0" />
              <span>Đăng nhập nhanh Admin</span>
            </div>
            <span className="text-[10px] uppercase font-black text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded">
              ADMIN
            </span>
          </button>
          <button
            onClick={() => handleFastFill('EMPLOYEE')}
            className="w-full text-left bg-amber-950/30 border border-amber-900/60 hover:bg-amber-900/30 text-amber-300 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-amber-400 shrink-0" />
              <span>Đăng nhập nhanh Nhân viên</span>
            </div>
            <span className="text-[10px] uppercase font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
              STAFF
            </span>
          </button>
          <button
            onClick={() => handleFastFill('CUSTOMER')}
            className="w-full text-left bg-emerald-950/30 border border-emerald-900/60 hover:bg-emerald-900/30 text-emerald-300 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span>Đăng nhập nhanh Khách hàng</span>
            </div>
            <span className="text-[10px] uppercase font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
              MEMBER
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
