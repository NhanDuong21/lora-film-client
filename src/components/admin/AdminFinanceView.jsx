import { useState, useMemo } from 'react';
import { Search, CircleDollarSign } from 'lucide-react';

export default function AdminFinanceView({
  activeTab,
  tickets,
  concessions,
  customers,
  employees,
  updateCustomersState,
  updateEmployeesState,
  triggerToast
}) {
  const [ticketSearch, setTicketSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // 1. Filter Tickets
  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    return tickets.filter(t => 
      t?.id?.toLowerCase()?.includes(ticketSearch?.toLowerCase() ?? '') || 
      t?.customerName?.toLowerCase()?.includes(ticketSearch?.toLowerCase() ?? '')
    );
  }, [tickets, ticketSearch]);

  // 2. Filter Customers
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(c => 
      c?.name?.toLowerCase()?.includes(customerSearch?.toLowerCase() ?? '') || 
      c?.email?.toLowerCase()?.includes(customerSearch?.toLowerCase() ?? '')
    );
  }, [customers, customerSearch]);

  // 3. Customer Tier Toggle
  const handleToggleCustomerTier = (id) => {
    const updated = customers.map(c => {
      if (c.id === id) {
        const newTier = c.tier === 'VIP' ? 'Standard' : 'VIP';
        return { 
          ...c, 
          tier: newTier, 
          points: newTier === 'VIP' ? Math.max(c.points, 500) : c.points 
        };
      }
      return c;
    });
    updateCustomersState(updated);
    triggerToast('Cập nhật hạng thành viên thành công!');
  };

  // 4. Employee Payroll Handlers
  const handleAdjustWage = (id, newWage) => {
    const updated = employees.map(emp => 
      emp.id === id ? { ...emp, hourlyWage: parseInt(newWage) || 0 } : emp
    );
    updateEmployeesState(updated);
  };

  const handleAdjustMultiplier = (id, newMultiplier) => {
    const updated = employees.map(emp => 
      emp.id === id ? { ...emp, activeMultiplier: parseFloat(newMultiplier) || 1.0 } : emp
    );
    updateEmployeesState(updated);
  };

  const handlePayrollApprove = () => {
    triggerToast('Duyệt chi lương tháng này thành công! Hóa đơn kế toán đã được kết xuất.');
  };

  return (
    <div className="space-y-6">
      {/* Tab: Tickets (Quản lý vé bán) */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-zinc-50 uppercase tracking-wide">SỔ NHẬT KÝ BÁN VÉ</h3>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wide">Tra cứu lịch sử xuất vé, hóa đơn điện tử và trạng thái check-in của khách hàng</p>
            </div>
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder="Tìm kiếm theo mã vé hoặc tên khách hàng..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral transition-colors"
              />
            </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-400">
                <thead className="bg-zinc-950/80 text-zinc-400 font-black uppercase tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-6">Mã vé</th>
                    <th className="py-4 px-6">Khách hàng</th>
                    <th className="py-4 px-6">Phim</th>
                    <th className="py-4 px-6">Suất chiếu</th>
                    <th className="py-4 px-6">Ghế</th>
                    <th className="py-4 px-6">Tổng tiền</th>
                    <th className="py-4 px-6">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredTickets && filteredTickets.length > 0 ? (
                    filteredTickets.map((t, index) => (
                      <tr key={t?.id ?? index} className="hover:bg-zinc-900/20 transition-colors border-b border-zinc-800/40">
                        <td className="py-4 px-6 font-mono text-brand-yellow font-bold">{t?.id ?? ''}</td>
                        <td className="py-4 px-6 font-bold text-zinc-200">
                          <div>{t?.customerName ?? 'Chưa rõ khách'}</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{t?.customerEmail ?? ''}</div>
                        </td>
                        <td className="py-4 px-6 text-zinc-200 font-medium">{t?.movieTitle ?? ''}</td>
                        <td className="py-4 px-6 font-semibold text-brand-coral">{t?.time ?? ''} | {t?.date ?? ''}</td>
                        <td className="py-4 px-6 text-zinc-200 font-medium">{(t?.seats ?? []).join(', ')}</td>
                        <td className="py-4 px-6 text-emerald-400 font-black text-sm">{(t?.totalAmount ?? 0).toLocaleString('vi-VN')} đ</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            t?.status === 'DA_KIEM_TRA' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                          }`}>
                            {t?.status === 'DA_KIEM_TRA' ? 'ĐÃ KIỂM TRA' : 'CHƯA CHECK-IN'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-zinc-500 font-semibold">
                        Không tìm thấy vé nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Concessions (Doanh thu bắp nước - Concession Counter Stocks Tracker) */}
      {activeTab === 'concessions' && (
        <div className="space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-base font-bold text-zinc-50 uppercase tracking-wide">DOANH THU DỊCH VỤ BẮP NƯỚC</h3>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wide">Báo cáo sản lượng tiêu thụ các gói Combo thức ăn nhanh tại quầy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concessions && concessions.length > 0 ? (
              concessions.map((c, index) => {
                // Ensure we translate key names exactly:
                // Combo Solo, Combo Couple, Combo Family, Popcorn Ngọt, Coca Cola
                let displayName = c?.name ?? 'Sản phẩm dịch vụ';
                if (c?.name === 'Popcorn Ngot') displayName = 'Popcorn Ngọt';
                
                const price = c?.price ?? 0;
                const salesCount = c?.salesCount ?? 0;
                const totalIncome = price * salesCount;

                return (
                  <div 
                    key={c?.id ?? index} 
                    className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300"
                  >
                    <div>
                      <h4 className="font-black text-zinc-50 text-sm">{displayName}</h4>
                      <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{c?.details ?? ''}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-800/60 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block font-bold">Đã bán</span>
                        <span className="text-xs font-black text-amber-500">ĐÃ BÁN ({salesCount} phần)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase block font-bold">Doanh thu</span>
                        <span className="text-xs font-black text-emerald-400">DOANH THU ({totalIncome.toLocaleString('vi-VN')} đ)</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center p-8 text-zinc-500 font-medium bg-zinc-900/30 rounded-2xl border border-zinc-800/80">
                Chưa ghi nhận dữ liệu bắp nước.
              </div>
            )}
          </div>

          {/* Baseline summary ribbon card */}
          <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl flex items-center justify-between shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300 mt-6">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="w-5 h-5 text-brand-coral" />
              <span className="text-xs font-black text-zinc-50 uppercase tracking-wide">TỔNG DOANH THU KHU ẨM THỰC:</span>
            </div>
            <span className="text-xl font-black text-brand-coral">
              {(concessions ?? []).reduce((acc, c) => acc + ((c?.price ?? 0) * (c?.salesCount ?? 0)), 0).toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>
      )}

      {/* Tab: Customers (Danh sách khách hàng - Member Registration Directory) */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-4">
            <div>
              <h3 className="text-base font-bold text-zinc-100 uppercase tracking-wider">Danh Sách Hội Viên</h3>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Quản lý cấp bậc, điểm tích lũy của thành viên đăng ký</p>
            </div>
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Tìm kiếm khách hàng..."
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 pl-9 pr-4 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral transition-colors"
              />
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-400">
                <thead className="bg-zinc-950/80 text-zinc-500 font-black uppercase tracking-wider border-b border-zinc-900">
                  <tr>
                    <th className="py-4 px-6">Tên Khách Hàng</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Hạng Thành Viên</th>
                    <th className="py-4 px-6">Điểm Tích Lũy</th>
                    <th className="py-4 px-6">Số Vé Đã Mua</th>
                    <th className="py-4 px-6 text-center w-40">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {filteredCustomers && filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c, index) => {
                      const isVIP = c?.tier?.toUpperCase() === 'VIP';
                      return (
                        <tr key={c?.id ?? index} className="hover:bg-zinc-900/20 transition-colors">
                          <td className="py-4 px-6 font-bold text-zinc-100">{c?.name ?? 'Không rõ khách'}</td>
                          <td className="py-4 px-6 font-mono text-zinc-400">{c?.email ?? ''}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${
                              isVIP
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                            }`}>
                              {isVIP ? 'VIP' : 'STANDARD'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-zinc-300">{c?.points ?? 0} điểm</td>
                          <td className="py-4 px-6 text-zinc-300 font-medium">{c?.ticketsBought ?? 0} vé</td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleToggleCustomerTier(c.id)}
                              className="text-[11px] font-black text-brand-coral hover:underline focus:outline-none"
                            >
                              {isVIP ? 'Hạ xuống Standard' : 'Thăng lên VIP'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-zinc-500 font-semibold">
                        Không tìm thấy khách hàng nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Payroll (Bảng lương nhân viên - Employee Payroll Ledger) */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <div>
              <h3 className="text-base font-bold text-zinc-100 uppercase tracking-wider">Sổ Kế Toán Nhân Sự</h3>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Xem giờ công, quản lý hệ số và duyệt chi tiền lương nhân sự</p>
            </div>
            <button
              onClick={handlePayrollApprove}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 px-4 rounded-xl uppercase tracking-wider transition-all"
            >
              DUYỆT CHI LƯƠNG
            </button>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-400">
                <thead className="bg-zinc-950/80 text-zinc-500 font-black uppercase tracking-wider border-b border-zinc-900">
                  <tr>
                    <th className="py-4 px-6">Tên Nhân Viên</th>
                    <th className="py-4 px-6">Chức Vụ</th>
                    <th className="py-4 px-6">Giờ Làm Việc</th>
                    <th className="py-4 px-6">Lương Giờ (VNĐ)</th>
                    <th className="py-4 px-6">Hệ Số Nhân</th>
                    <th className="py-4 px-6 text-right">Lương Thực Nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {employees && employees.length > 0 ? (
                    employees.map((emp, index) => {
                      const hoursWorked = emp?.hoursWorked ?? 0;
                      const hourlyWage = emp?.hourlyWage ?? 0;
                      const activeMultiplier = emp?.activeMultiplier ?? 1.0;
                      const finalSalary = hoursWorked * hourlyWage * activeMultiplier;
                      return (
                        <tr key={emp?.id ?? index} className="hover:bg-zinc-900/20 transition-colors">
                          <td className="py-4 px-6 font-bold text-zinc-100">
                            <div>{emp?.name ?? 'Chưa rõ nhân viên'}</div>
                            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{emp?.email ?? ''}</div>
                          </td>
                          <td className="py-4 px-6 font-bold text-zinc-300">
                            {emp?.role === 'Cashier' ? 'Thu Ngân' : emp?.role === 'Supervisor' ? 'Giám Sát' : (emp?.role ?? '')}
                          </td>
                          <td className="py-4 px-6 text-zinc-300 font-medium">{hoursWorked} giờ</td>
                          <td className="py-4 px-6">
                            <input
                              type="number"
                              value={hourlyWage}
                              onChange={(e) => handleAdjustWage(emp.id, e.target.value)}
                              className="w-28 bg-zinc-950 border border-zinc-900 rounded-xl py-1 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <input
                              type="number"
                              step="0.1"
                              value={activeMultiplier}
                              onChange={(e) => handleAdjustMultiplier(emp.id, e.target.value)}
                              className="w-20 bg-zinc-950 border border-zinc-900 rounded-xl py-1 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                            />
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="text-emerald-400 font-black text-sm">
                              LƯƠNG THỰC NHẬN ({finalSalary.toLocaleString('vi-VN')} đ)
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-8 text-zinc-500 font-medium">
                        Chưa ghi nhận dữ liệu lương nhân sự.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Delays (Cấu hình ngưỡng trễ lịch chiếu) */}
      {activeTab === 'delays' && (
        <div className="space-y-6">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="text-base font-bold text-zinc-100 uppercase tracking-wider">Cấu Hình Ngưỡng Trễ Lịch Chiếu</h3>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Quản lý trễ giờ phát suất chiếu và kích hoạt đóng tự động</p>
          </div>
          <div className="max-w-md bg-zinc-900/40 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <label className="text-zinc-500 text-[10px] font-black uppercase">Thời gian trễ tối đa cho phép (phút)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 px-4 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-500 text-[10px] font-black uppercase">Tự động đóng suất chiếu sau thời gian trễ</label>
              <select className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 px-4 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral">
                <option value="yes">Kích hoạt</option>
                <option value="no">Vô hiệu hóa</option>
              </select>
            </div>
            <button
              onClick={() => triggerToast('Đã lưu cấu hình trễ lịch chiếu thành công!')}
              className="bg-brand-coral hover:bg-opacity-90 text-white font-black text-xs py-3 px-6 rounded-xl uppercase tracking-wider transition-all"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      )}

      {/* Tab: Pricing (Hệ số phụ thu giá vé) */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="text-base font-bold text-zinc-100 uppercase tracking-wider">Hệ Số Giá Vé & Phụ Thu</h3>
            <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Thiết lập mức phụ thu định dạng phòng chiếu và hệ số giờ cao điểm</p>
          </div>
          <div className="max-w-md bg-zinc-900/40 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <label className="text-zinc-500 text-[10px] font-black uppercase">Phụ thu suất chiếu IMAX (VNĐ)</label>
              <input
                type="number"
                defaultValue={50000}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 px-4 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-zinc-500 text-[10px] font-black uppercase">Hệ số giá vé dịp cuối tuần (T6-CN)</label>
              <input
                type="number"
                step="0.1"
                defaultValue={1.2}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-3 px-4 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
              />
            </div>
            <button
              onClick={() => triggerToast('Đã lưu hệ số phụ thu giá vé thành công!')}
              className="bg-brand-coral hover:bg-opacity-90 text-white font-black text-xs py-3 px-6 rounded-xl uppercase tracking-wider transition-all"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
