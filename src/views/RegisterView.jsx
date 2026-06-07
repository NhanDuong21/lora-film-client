import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ShieldAlert, ArrowLeft, Loader2, CheckCircle2, Phone, Calendar, Eye, EyeOff } from 'lucide-react';

export default function RegisterView({ onBack, onLoginLink, onSuccessRedirect }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('NAM');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Input Validations
    if (!fullName || !email || !phone || !gender || !dateOfBirth || !password || !confirmPassword) {
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
      const res = register(fullName, email, password, phone, gender, dateOfBirth);
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
      <div className="w-full max-w-lg bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 relative z-10 shadow-2xl">
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
          
          {/* Row 1: Họ và tên & Địa chỉ Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ và tên */}
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
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
                  required
                />
              </div>
            </div>

            {/* Địa chỉ Email */}
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
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2: Số điện thoại & Giới tính */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Số điện thoại Input */}
            <div className="space-y-1">
              <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Số điện thoại</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-100 transition-colors placeholder:text-zinc-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Giới tính Custom Switch Picker */}
            <div className="space-y-1">
              <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Giới tính</label>
              <div className="flex items-center gap-6 py-3 px-4 bg-zinc-950 border border-zinc-800 rounded-xl h-[46px]">
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="NAM" 
                    checked={gender === 'NAM'} 
                    onChange={() => setGender('NAM')}
                    className="accent-amber-500 text-amber-500 bg-zinc-950 w-4 h-4 focus:ring-amber-500/30" 
                  />
                  <span>Nam</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="NU" 
                    checked={gender === 'NU'} 
                    onChange={() => setGender('NU')}
                    className="accent-amber-500 text-amber-500 bg-zinc-950 w-4 h-4 focus:ring-amber-500/30" 
                  />
                  <span>Nữ</span>
                </label>
              </div>
            </div>
          </div>

          {/* Row 3: Date of Birth Picker Component */}
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Ngày sinh</label>
            <div className="relative">
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-4 py-3 pr-10 text-sm text-zinc-100 transition-colors placeholder:text-zinc-600 focus:outline-none dark:[color-scheme:dark]"
                required
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-550 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Row 4: Password Matrix with Visibility Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mật khẩu */}
            <div className="space-y-1">
              <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu tối thiểu 6 ký tự"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-550 hover:text-zinc-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="space-y-1">
              <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">Xác nhận mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-550 hover:text-zinc-300 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Row 5: Mandatory Policy Agreement & Submit */}
          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 text-xs text-zinc-400 cursor-pointer select-none">
              <input type="checkbox" className="mt-0.5 rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500/30 numeric-checkbox" required />
              <span>Bằng việc đăng ký tài khoản, tôi đồng ý với <span className="text-amber-500 hover:underline">Điều khoản dịch vụ</span> và <span className="text-amber-500 hover:underline">Chính sách bảo mật</span> của LoraFilm.</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !!successMsg}
              className="w-full bg-gradient-to-r from-coral-500 to-amber-500 hover:opacity-95 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg font-sans uppercase tracking-wider tracking-widest mt-4 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý đăng ký...</span>
                </>
              ) : (
                <span>XÁC NHẬN ĐĂNG KÝ</span>
              )}
            </button>
          </div>
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
