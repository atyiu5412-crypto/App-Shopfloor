import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StationTabs from './components/StationTabs';
import StationPage from './pages/StationPage';
import { loadProductionItemsFromJson } from './utils/mappers';
import type { ProductionItem } from './types/production';

export default function App() {
  // โหลดข้อมูลเริ่มต้นจาก JSON ใน src/data/ และเก็บ state ไว้ที่ App เพื่อให้ยอดที่ส่งแล้วไม่หายเวลาสลับแท็บ
  const [items, setItems] = useState<ProductionItem[]>(() => loadProductionItemsFromJson());

  const handleSent = (id: number, sentPieces: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, sentPieces: item.sentPieces + sentPieces } : item,
      ),
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        {/* Header แถบด้านบน */}
        <header className="bg-slate-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏭</span>
              <div>
                <h1 className="text-lg font-bold">Production App Shopfloor</h1>
                <p className="text-xs text-slate-400">ระบบติดตามการผลิตแยกตามสถานีงาน</p>
              </div>
            </div>
            <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
              สถานะ: ออนไลน์
            </div>
          </div>
        </header>

        {/* เนื้อหาหลัก */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
          {/* แถบ Tab Station 1, 2, 3 */}
          <StationTabs items={items} />

          {/* กำหนดเส้นทาง URL (Routing) */}
          <Routes>
            <Route path="/" element={<Navigate to="/station/1" replace />} />
            <Route
              path="/station/:stationId"
              element={<StationPage items={items} onSent={handleSent} />}
            />
            <Route path="*" element={<Navigate to="/station/1" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
