import { useState } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Building2, 
  CircleDollarSign, 
  Users, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Home, 
  LogOut
} from 'lucide-react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  user, 
  onBackHome, 
  handleLogout 
}) {
  const [expandedSections, setExpandedSections] = useState({
    noiDung: true,
    coSo: true,
    kinhDoanh: false,
    nguoiDung: false,
    cauHinh: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTabClick = (tabKey, hash = null) => {
    setActiveTab(tabKey);
    if (hash) {
      window.location.hash = hash;
    }
  };

  return (
    <aside className="w-full lg:w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Logo Section */}
        <div className="p-6 border-b border-zinc-800">
          <span className="text-brand-coral font-black tracking-widest text-lg uppercase block mb-1">
            Lora Film
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-brand-yellow text-black">
              {userRole || 'ADMIN'}
            </span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
              Trang Quản Trị
            </span>
          </div>
        </div>

        {/* Navigation Items Accordion */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[65vh] scrollbar-thin">
          {/* Dashboard Link */}
          <button
            onClick={() => handleTabClick('dashboard', '#/admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-brand-coral/10 text-brand-coral border-l-4 border-brand-coral'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard (Tổng Quan)</span>
          </button>

          {/* Quản Lý Nội Dung Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('noiDung')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-800/50 hover:text-white uppercase cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4 shrink-0" />
                <span>Quản Lý Nội Dung</span>
              </div>
              {expandedSections.noiDung ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expandedSections.noiDung && (
              <div className="pl-8 space-y-1">
                <button
                  onClick={() => handleTabClick('movies', '#/admin/movies')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'movies' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Quản lý phim
                </button>
                <button
                  onClick={() => handleTabClick('actors')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'actors' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Quản lý diễn viên
                </button>
                <button
                  onClick={() => handleTabClick('showtimes')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'showtimes' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Quản lý suất chiếu
                </button>
                <button
                  onClick={() => handleTabClick('events-promo', '#/admin-events')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'events-promo' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Quản lý Sự kiện & Khuyến mãi
                </button>
              </div>
            )}
          </div>

          {/* Quản Lý Cơ Sở Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('coSo')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-800/50 hover:text-white uppercase cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Quản Lý Cơ Sở</span>
              </div>
              {expandedSections.coSo ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expandedSections.coSo && (
              <div className="pl-8 space-y-1">
                <button
                  onClick={() => handleTabClick('clusters')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'clusters' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Cụm rạp & Phòng chiếu
                </button>
              </div>
            )}
          </div>

          {/* Vận Hành Kinh Doanh Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('kinhDoanh')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-800/50 hover:text-white uppercase cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <CircleDollarSign className="w-4 h-4 shrink-0" />
                <span>Vận Hành Kinh Doanh</span>
              </div>
              {expandedSections.kinhDoanh ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expandedSections.kinhDoanh && (
              <div className="pl-8 space-y-1">
                <button
                  onClick={() => handleTabClick('tickets')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'tickets' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Quản lý vé bán
                </button>
                <button
                  onClick={() => handleTabClick('concessions')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'concessions' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Doanh thu bắp nước
                </button>
              </div>
            )}
          </div>

          {/* Quản Lý Người Dùng Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('nguoiDung')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-800/50 hover:text-white uppercase cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 shrink-0" />
                <span>Nhân Sự & Khách Hàng</span>
              </div>
              {expandedSections.nguoiDung ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expandedSections.nguoiDung && (
              <div className="pl-8 space-y-1">
                <button
                  onClick={() => handleTabClick('customers')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'customers' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Danh sách khách hàng
                </button>
                <button
                  onClick={() => handleTabClick('payroll')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'payroll' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Bảng lương nhân viên
                </button>
              </div>
            )}
          </div>

          {/* Cấu Hình Phim Section */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('cauHinh')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-800/50 hover:text-white uppercase cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 shrink-0" />
                <span>Cấu Hình & Bảo Mật</span>
              </div>
              {expandedSections.cauHinh ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {expandedSections.cauHinh && (
              <div className="pl-8 space-y-1">
                <button
                  onClick={() => handleTabClick('delays')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'delays' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Ngưỡng trễ lịch chiếu
                </button>
                <button
                  onClick={() => handleTabClick('pricing')}
                  className={`w-full text-left py-2 px-3 rounded text-[11px] font-semibold block cursor-pointer ${activeTab === 'pricing' ? 'text-brand-coral bg-white/5 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Hệ số giá vé
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-zinc-800 space-y-2 mt-auto">
        <div className="px-4 py-2">
          <p className="text-xs text-zinc-500 font-bold uppercase">Người dùng</p>
          <p className="text-sm font-bold text-white truncate">{user?.fullName || 'Administrator'}</p>
        </div>

        <button
          onClick={onBackHome}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
