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
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onBackHome, 
  handleLogout 
}) {
  // Collapsible categories state (default all open)
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

  // Helper function to return styling for a navigation item based on its active state
  const getItemClass = (tabKey) => {
    const isActive = activeTab === tabKey;
    if (isActive) {
      return "w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-l-4 border-amber-500 bg-zinc-800/60 text-amber-400";
    }
    return "w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50";
  };

  return (
    <aside className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 z-30 select-none">
      
      {/* Brand Top Header */}
      <div>
        <div className="p-6 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-black text-black text-base shadow-lg shadow-amber-500/20">
              L
            </div>
            <div>
              <span className="text-sm font-black text-zinc-50 uppercase tracking-widest block">LoraFilm</span>
              <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider block">Trang Quản Trị</span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          
          {/* Section 1: Dashboard */}
          <div>
            <button
              onClick={() => handleTabClick('dashboard', '#/admin')}
              className={getItemClass('dashboard')}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>➊ DASHBOARD (TỔNG QUAN)</span>
            </button>
          </div>

          {/* Section 2: Quản Lý Nội Dung */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('noiDung')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➋ QUẢN LÝ NỘI DUNG</span>
              {collapsedSections.noiDung ? (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-550" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-550" />
              )}
            </button>

            {!collapsedSections.noiDung && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('movies', '#/admin/movies')}
                  className={getItemClass('movies')}
                >
                  <Film className="w-3.5 h-3.5 shrink-0" />
                  <span>Quản lý phim</span>
                </button>
                <button
                  onClick={() => handleTabClick('actors', '#/admin/actors')}
                  className={getItemClass('actors')}
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>Quản lý diễn viên</span>
                </button>
                <button
                  onClick={() => handleTabClick('showtimes', '#/admin/showtimes')}
                  className={getItemClass('showtimes')}
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Quản lý suất chiếu</span>
                </button>
                <button
                  onClick={() => handleTabClick('events-promo', '#/admin/events')}
                  className={getItemClass('events-promo')}
                >
                  <Gift className="w-3.5 h-3.5 shrink-0" />
                  <span>Sự kiện & Khuyến mãi</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Quản Lý Cơ Sở */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('coSo')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➌ QUẢN LÝ CƠ SỞ</span>
              {collapsedSections.coSo ? (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-550" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-550" />
              )}
            </button>

            {!collapsedSections.coSo && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('clusters', '#/admin/clusters')}
                  className={getItemClass('clusters')}
                >
                  <Database className="w-3.5 h-3.5 shrink-0" />
                  <span>Cụm rạp & Phòng chiếu</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Vận Hành Kinh Doanh */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('vanHanh')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➍ VẬN HÀNH KINH DOANH</span>
              {collapsedSections.vanHanh ? (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-550" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-550" />
              )}
            </button>

            {!collapsedSections.vanHanh && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('tickets', '#/admin/tickets')}
                  className={getItemClass('tickets')}
                >
                  <Ticket className="w-3.5 h-3.5 shrink-0" />
                  <span>Quản lý vé bán</span>
                </button>
                <button
                  onClick={() => handleTabClick('concessions', '#/admin/concessions')}
                  className={getItemClass('concessions')}
                >
                  <Coffee className="w-3.5 h-3.5 shrink-0" />
                  <span>Doanh thu bắp nước</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 5: Nhân Sự & Khách Hàng */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('nhanSu')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➎ NHÂN SỰ & KHÁCH HÀNG</span>
              {collapsedSections.nhanSu ? (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-550" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-550" />
              )}
            </button>

            {!collapsedSections.nhanSu && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('customers', '#/admin/customers')}
                  className={getItemClass('customers')}
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>Danh sách khách hàng</span>
                </button>
                <button
                  onClick={() => handleTabClick('payroll', '#/admin/payroll')}
                  className={getItemClass('payroll')}
                >
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>Bảng lương nhân viên</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 6: Cấu Hình & Bảo Mật */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('cauHinh')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➏ CẤU HÌNH & BẢO MẬT</span>
              {collapsedSections.cauHinh ? (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-550" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-550" />
              )}
            </button>

            {!collapsedSections.cauHinh && (
              <div className="space-y-1">
                <button
                  onClick={() => handleTabClick('delays', '#/admin/delays')}
                  className={getItemClass('delays')}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Ngưỡng trễ lịch chiếu</span>
                </button>
                <button
                  onClick={() => handleTabClick('pricing', '#/admin/pricing')}
                  className={getItemClass('pricing')}
                >
                  <Settings className="w-3.5 h-3.5 shrink-0" />
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
              <span className="text-xs text-zinc-200 font-black block truncate">
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
