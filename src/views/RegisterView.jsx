import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ShieldAlert, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterView({ onBack, onLoginLink, onSuccessRedirect }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Input Validations
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ tất cả thông tin đăng ký!');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu đăng ký phải có độ dài từ 6 ký tự trở lên!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = register(fullName, email, password);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMsg('Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...');
        // Wait 1.5s then redirect to login view
        setTimeout(() => {
          onSuccessRedirect();
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    }, 800);
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
          <h2 className="text-2xl md:text-3xl font-black tracking-wider uppercase text-white">ĐĂNG KÝ THÀNH VIÊN</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Đăng ký tham gia LoraFilm</p>
        </div>

        {/* Error notification bar */}
        {errorMsg && (
          <div className="mb-6 bg-red-950/50 border border-red-800/80 rounded-xl p-4 flex items-start gap-3 text-red-200 text-xs leading-relaxed animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success notification bar */}
        {successMsg && (
          <div className="mb-6 bg-emerald-950/50 border border-emerald-800/80 rounded-xl p-4 flex items-start gap-3 text-emerald-200 text-xs leading-relaxed">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Họ và Tên</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-brand-coral rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

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
                placeholder="example@gmail.com"
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
                placeholder="Mật khẩu tối thiểu 6 ký tự"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-brand-coral rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          {/* Confirm Password input */}
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Xác nhận mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu đăng ký"
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-brand-coral rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || !!successMsg}
            className="w-full bg-brand-coral hover:bg-opacity-90 disabled:bg-zinc-800 text-white font-black py-3.5 rounded-xl shadow-lg shadow-brand-coral/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-wider text-xs flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý đăng ký...</span>
              </>
            ) : (
              <span>Xác nhận Đăng Ký</span>
            )}
          </button>
        </form>

        {/* Login Redirection Link */}
        <div className="text-center mt-6 text-xs text-zinc-400">
          Đã có tài khoản thành viên?{' '}
          <button
            onClick={onLoginLink}
            className="text-brand-coral font-bold hover:underline focus:outline-none"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
}
