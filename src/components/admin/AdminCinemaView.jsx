import { useState, useMemo } from 'react';
import { PlusCircle, X } from 'lucide-react';

export default function AdminCinemaView({ 
  theaters, 
  updateTheatersState, 
  triggerToast 
}) {
  const [selectedTheaterId, setSelectedTheaterId] = useState(1);
  const [theaterModalOpen, setTheaterModalOpen] = useState(false);
  const [theaterForm, setTheaterForm] = useState({ name: '', address: '', defaultHallsCount: 3 });

  const [hallModalOpen, setHallModalOpen] = useState(false);
  const [targetTheaterIdForHall, setTargetTheaterIdForHall] = useState(null);
  const [hallForm, setHallForm] = useState({ name: '', capacity: 120, format: '2D Digital' });

  const selectedTheater = useMemo(() => {
    return theaters.find(t => t.id === selectedTheaterId) || theaters[0];
  }, [theaters, selectedTheaterId]);

  const handleOpenAddTheater = () => {
    setTheaterForm({ name: '', address: '', defaultHallsCount: 3 });
    setTheaterModalOpen(true);
  };

  const handleSaveTheater = (e) => {
    e.preventDefault();
    if (!theaterForm.name || !theaterForm.address) {
      triggerToast('Vui lòng điền đầy đủ tên và địa chỉ cụm rạp!', 'error');
      return;
    }

    const newTheaterId = Date.now();
    const count = parseInt(theaterForm.defaultHallsCount) || 3;
    const halls = [];
    for (let i = 1; i <= count; i++) {
      halls.push({
        id: `${newTheaterId}-${i}`,
        name: `Phòng Chiếu ${i}`,
        capacity: 120,
        format: '2D Digital'
      });
    }

    const newTheater = {
      id: newTheaterId,
      name: theaterForm.name,
      address: theaterForm.address,
      halls
    };

    const updated = [...theaters, newTheater];
    updateTheatersState(updated);
    setSelectedTheaterId(newTheaterId);
    setTheaterModalOpen(false);
    triggerToast('Thêm cụm rạp mới thành công!');
  };

  const handleOpenAddHall = (theaterId) => {
    setTargetTheaterIdForHall(theaterId);
    const matchedT = theaters.find(t => t.id === theaterId);
    setHallForm({ 
      name: `Phòng Chiếu ${matchedT ? matchedT.halls.length + 1 : 1}`, 
      capacity: 120, 
      format: '2D Digital' 
    });
    setHallModalOpen(true);
  };

  const handleSaveHall = (e) => {
    e.preventDefault();
    if (!hallForm.name) {
      triggerToast('Vui lòng nhập tên phòng chiếu!', 'error');
      return;
    }

    const updated = theaters.map(t => {
      if (t.id === targetTheaterIdForHall) {
        return {
          ...t,
          halls: [
            ...t.halls,
            { 
              id: `${t.id}-${t.halls.length + 1}-${Date.now()}`, 
              name: hallForm.name, 
              capacity: parseInt(hallForm.capacity) || 120, 
              format: hallForm.format 
            }
          ]
        };
      }
      return t;
    });

    updateTheatersState(updated);
    setHallModalOpen(false);
    triggerToast('Đã thêm phòng chiếu mới thành công!');
  };

  const handleRenameHall = (theaterId, hallId) => {
    const newName = prompt('Nhập tên phòng chiếu mới:');
    if (!newName) return;

    const updated = theaters.map(t => {
      if (t.id === theaterId) {
        return {
          ...t,
          halls: t.halls.map(h => h.id === hallId ? { ...h, name: newName } : h)
        };
      }
      return t;
    });

    updateTheatersState(updated);
    triggerToast('Đã đổi tên phòng chiếu thành công!');
  };

  const handleDeleteHall = (theaterId, hallId) => {
    if (confirm('Bạn có chắc chắn muốn xóa phòng chiếu này?')) {
      const updated = theaters.map(t => {
        if (t.id === theaterId) {
          return {
            ...t,
            halls: t.halls.filter(h => h.id !== hallId)
          };
        }
        return t;
      });
      updateTheatersState(updated);
      triggerToast('Đã xóa phòng chiếu thành công!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header Titles */}
      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
        <div>
          <h3 className="text-base font-bold text-zinc-100 uppercase tracking-wider">Cơ Sở & Phòng Chiếu</h3>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Cấu hình cụm rạp và các buồng chiếu phim</p>
        </div>
      </div>

      {/* Dual Panel Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3 Width Cluster Selector) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex justify-between items-center pb-2">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">
              Danh sách cụm rạp
            </span>
            <button
              onClick={handleOpenAddTheater}
              className="flex items-center gap-1 bg-brand-coral hover:bg-opacity-90 text-white text-[10px] font-black py-1.5 px-3 rounded-lg uppercase tracking-wider transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm Rạp Mới</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {theaters.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTheaterId(t.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  (selectedTheater && selectedTheater.id === t.id)
                    ? 'bg-brand-coral/10 border-brand-coral text-white' 
                    : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/60'
                }`}
              >
                <h4 className="font-bold text-sm text-zinc-100">{t.name}</h4>
                <p className="text-[11px] text-zinc-400 truncate mt-1">{t.address}</p>
              </button>
            ))}
            {theaters.length === 0 && (
              <div className="text-center py-8 text-zinc-650 text-xs font-semibold uppercase">Chưa có cụm rạp nào</div>
            )}
          </div>
        </div>

        {/* Right Column (2/3 Width Room Controller Spreadsheet) */}
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl space-y-6 shadow-xl">
          {selectedTheater ? (
            <>
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div>
                  <h3 className="font-black text-zinc-100 text-base">{selectedTheater.name}</h3>
                  <p className="text-zinc-400 text-xs mt-0.5">{selectedTheater.address}</p>
                </div>
                <button
                  onClick={() => handleOpenAddHall(selectedTheater.id)}
                  className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-[10px] font-black px-3.5 py-2 rounded-xl text-white transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-brand-coral" />
                  <span>THÊM PHÒNG CHIẾU</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {selectedTheater.halls && selectedTheater.halls.map(h => (
                  <div 
                    key={h.id} 
                    className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-zinc-800 transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-zinc-150 text-sm">{h.name}</h4>
                      <span className="text-[10px] text-zinc-400 block uppercase font-bold mt-1.5">
                        Định dạng: {h.format} | Sức chứa: {h.capacity} ghế
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRenameHall(selectedTheater.id, h.id)}
                        className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-850 text-[10px] font-black text-zinc-400 border border-zinc-900 hover:text-white rounded-xl transition-all"
                      >
                        Đổi tên
                      </button>
                      <button
                        onClick={() => handleDeleteHall(selectedTheater.id, h.id)}
                        className="py-1.5 px-3 bg-red-950/20 border border-red-900/30 hover:border-red-900/60 text-[10px] font-black text-red-400 rounded-xl transition-all"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
                {(!selectedTheater.halls || selectedTheater.halls.length === 0) && (
                  <div className="text-center py-12 text-zinc-650 text-xs font-semibold uppercase">Chưa có phòng chiếu nào</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-24 text-zinc-650 text-xs font-bold uppercase tracking-wider">
              Vui lòng chọn một cụm rạp để xem chi tiết
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Theater */}
      {theaterModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveTheater} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-base font-black text-zinc-100 uppercase tracking-wider">THÊM CỤM RẠP MỚI</h3>
              <button type="button" onClick={() => setTheaterModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Tên cụm rạp</label>
              <input
                type="text"
                value={theaterForm.name}
                onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })}
                placeholder="Ví dụ: Lora Nguyễn Du"
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Địa chỉ</label>
              <input
                type="text"
                value={theaterForm.address}
                onChange={(e) => setTheaterForm({ ...theaterForm, address: e.target.value })}
                placeholder="Ví dụ: 116 Nguyễn Du, Quận 1, TP. HCM"
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Số lượng phòng chiếu mặc định</label>
              <input
                type="number"
                min="1"
                max="10"
                value={theaterForm.defaultHallsCount}
                onChange={(e) => setTheaterForm({ ...theaterForm, defaultHallsCount: parseInt(e.target.value) || 1 })}
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-opacity-90 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              LƯU THÔNG TIN
            </button>
          </form>
        </div>
      )}

      {/* Modal Add Hall */}
      {hallModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveHall} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-base font-black text-zinc-100 uppercase tracking-wider">THÊM PHÒNG CHIẾU MỚI</h3>
              <button type="button" onClick={() => setHallModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Tên phòng chiếu</label>
              <input
                type="text"
                value={hallForm.name}
                onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
                placeholder="Ví dụ: Phòng Chiếu 5"
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Sức chứa (Ghế)</label>
              <input
                type="number"
                min="10"
                max="300"
                value={hallForm.capacity}
                onChange={(e) => setHallForm({ ...hallForm, capacity: parseInt(e.target.value) || 120 })}
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Định dạng chiếu</label>
              <select
                value={hallForm.format}
                onChange={(e) => setHallForm({ ...hallForm, format: e.target.value })}
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
              >
                <option value="2D Digital">2D Digital</option>
                <option value="3D Digital">3D Digital</option>
                <option value="IMAX 3D">IMAX 3D</option>
                <option value="Gold Class">Gold Class</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-opacity-90 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              LƯU THÔNG TIN
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
