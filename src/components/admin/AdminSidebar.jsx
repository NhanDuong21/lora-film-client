import { useState } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Calendar, 
  Gift, 
  Database, 
  Ticket, 
  Coffee, 
  Clock, 
  Settings, 
  Home, 
  LogOut, 
  ChevronDown,
  TrendingUp,
  Building,
  Coins,
  Shield
} from 'lucide-react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onBackHome, 
  handleLogout 
}) {
  // Collapsible categories state (default false = expanded, true = collapsed)
  const [collapsedSections, setCollapsedSections] = useState({
    noiDung: false,
    coSo: false,
    vanHanh: false,
    nhanSu: false,
    cauHinh: false
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTabClick = (tabKey, hash) => {
    setActiveTab(tabKey);
    window.location.hash = hash;
  };

  // Helper function to return styling for nested child sub-links
  const getSubLinkClass = (tabKey) => {
    const isActive = activeTab === tabKey;
    if (isActive) {
      return "w-full flex items-center gap-3 pl-9 pr-4 py-2.5 text-sm font-semibold text-amber-400 bg-amber-500/10 rounded-xl border-l-4 border-amber-500 transition-all";
    }
    return "w-full flex items-center gap-3 pl-9 pr-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 rounded-xl transition-all";
  };

  // Helper function to return styling for standalone top-level links (e.g. Dashboard)
  const getTopLinkClass = (tabKey) => {
    const isActive = activeTab === tabKey;
    if (isActive) {
      return "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-amber-400 bg-amber-500/10 rounded-xl border-l-4 border-amber-500 transition-all";
    }
    return "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 rounded-xl transition-all";
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 z-30 select-none overflow-hidden">
      
      <div>
        {/* Brand Top Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-black text-black text-base shadow-lg shadow-amber-500/20">
              L
            </div>
            <div>
              <span className="text-sm font-black text-zinc-50 uppercase tracking-widest block">LoraFilm</span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Trang Quản Trị</span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          
          {/* Section 1: Bảng điều khiển */}
          <div>
            <button
              onClick={() => handleTabClick('dashboard', '#/admin')}
              className={getTopLinkClass('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>BẢNG ĐIỀU KHIỂN (TỔNG QUAN)</span>
            </button>
          </div>

          {/* Section 2: Quản Lý Nội Dung */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('noiDung')}
              className="w-full flex items-center justify-between px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 select-none font-mono hover:text-zinc-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 shrink-0" />
                <span>QUẢN LÝ NỘI DUNG</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                !collapsedSections.noiDung ? 'rotate-180' : ''
              }`} />
            </button>

            {!collapsedSections.noiDung && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('movies', '#/admin/movies')}
                  className={getSubLinkClass('movies')}
                >
                  <Film className="w-4 h-4 shrink-0" />
                  <span>Quản lý phim</span>
                </button>
                <button
                  onClick={() => handleTabClick('actors', '#/admin/actors')}
                  className={getSubLinkClass('actors')}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Diễn viên</span>
                </button>
                <button
                  onClick={() => handleTabClick('events-promo', '#/admin/events')}
                  className={getSubLinkClass('events-promo')}
                >
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>Sự kiện & Khuyến mãi</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Quản Lý Cơ Sở */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('coSo')}
              className="w-full flex items-center justify-between px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 select-none font-mono hover:text-zinc-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 shrink-0" />
                <span>QUẢN LÝ CƠ SỞ</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                !collapsedSections.coSo ? 'rotate-180' : ''
              }`} />
            </button>

            {!collapsedSections.coSo && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('clusters', '#/admin/clusters')}
                  className={getSubLinkClass('clusters')}
                >
                  <Database className="w-4 h-4 shrink-0" />
                  <span>Cụm rạp & Phòng chiếu</span>
                </button>
                <button
                  onClick={() => handleTabClick('showtimes', '#/admin/showtimes')}
                  className={getSubLinkClass('showtimes')}
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Quản lý suất chiếu</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Vận Hành Kinh Doanh */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('vanHanh')}
              className="w-full flex items-center justify-between px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 select-none font-mono hover:text-zinc-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 shrink-0" />
                <span>VẬN HÀNH KINH DOANH</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                !collapsedSections.vanHanh ? 'rotate-180' : ''
              }`} />
            </button>

            {!collapsedSections.vanHanh && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('tickets', '#/admin/tickets')}
                  className={getSubLinkClass('tickets')}
                >
                  <Ticket className="w-4 h-4 shrink-0" />
                  <span>Quản lý vé bán</span>
                </button>
                <button
                  onClick={() => handleTabClick('concessions', '#/admin/concessions')}
                  className={getSubLinkClass('concessions')}
                >
                  <Coffee className="w-4 h-4 shrink-0" />
                  <span>Doanh thu bắp nước</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 5: Nhân Sự & Khách Hàng */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('nhanSu')}
              className="w-full flex items-center justify-between px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 select-none font-mono hover:text-zinc-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>NHÂN SỰ & KHÁCH HÀNG</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                !collapsedSections.nhanSu ? 'rotate-180' : ''
              }`} />
            </button>

            {!collapsedSections.nhanSu && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('customers', '#/admin/customers')}
                  className={getSubLinkClass('customers')}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Danh sách khách hàng</span>
                </button>
                <button
                  onClick={() => handleTabClick('payroll', '#/admin/payroll')}
                  className={getSubLinkClass('payroll')}
                >
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>Bảng lương nhân viên</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 6: Cấu Hình & Bảo Mật */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('cauHinh')}
              className="w-full flex items-center justify-between px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 select-none font-mono hover:text-zinc-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span>CẤU HÌNH & BẢO MẬT</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                !collapsedSections.cauHinh ? 'rotate-180' : ''
              }`} />
            </button>

            {!collapsedSections.cauHinh && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('delays', '#/admin/delays')}
                  className={getSubLinkClass('delays')}
                >
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Ngưỡng trễ lịch chiếu</span>
                </button>
                <button
                  onClick={() => handleTabClick('pricing', '#/admin/pricing')}
                  className={getSubLinkClass('pricing')}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>Hệ số giá vé</span>
                </button>
              </div>
            )}
          </div>

        </nav>
      </div>

      {/* Pinned Bottom User Profile Card */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/80">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200 text-xs">
              AD
            </div>
            <div className="truncate">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Quản Trị Viên</span>
              <span className="text-xs text-zinc-250 font-black block truncate">
                {user?.fullName || 'Quản trị viên Lora'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-800 pt-2.5">
            <button 
              onClick={onBackHome}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-500 transition-colors"
              title="Quay lại trang chủ khách hàng"
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

    </aside>
  );
}
