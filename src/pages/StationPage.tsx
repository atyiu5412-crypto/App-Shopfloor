import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import RowCard from '../components/RowCard';
import {
  EMPTY_FILTERS,
  getRemainingPieces,
  getRemainingTrays,
  type Filters,
  type IssueType,
  type ProductionItem,
  type StationId,
} from '../types/production';

interface Props {
  items: ProductionItem[];
  onSent: (id: number, sentPieces: number) => void;
}

const STATION_INFO: Record<number, { title: string; icon: string }> = {
  1: {
    title: 'Station 1 ',
    icon: '🥣',
  },
  2: {
    title: 'Station 2',
    icon: '🔥',
  },
  3: {
    title: 'Station 3 ',
    icon: '📦',
  },
};

const formatNow = () =>
  new Date().toLocaleString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export default function StationPage({ items, onSent }: Props) {
  const { stationId } = useParams();
  const id = Number(stationId) as StationId;

  // เก็บค่า Filter แยกตามแต่ละ Station
  const [filtersByStation, setFiltersByStation] = useState<Partial<Record<StationId, Filters>>>({});
  const filters = filtersByStation[id] ?? EMPTY_FILTERS;

  const setFilters = (newFilters: Filters) => {
    setFiltersByStation((prev) => ({ ...prev, [id]: newFilters }));
  };

  // รายการเฉพาะของ Station นี้
  const stationItems = useMemo(
    () => items.filter((item) => item.station === id),
    [items, id],
  );

  // ดึงตัวเลือก Filter ที่มีจริงใน Station นี้
  const filterOptions = useMemo(() => {
    const products = [...new Set(stationItems.map((i) => i.productName))].sort((a, b) =>
      a.localeCompare(b, 'th'),
    );
    const factories = [...new Set(stationItems.map((i) => i.factory))].sort();
    const shippingTimes = [...new Set(stationItems.map((i) => i.shippingTime))].sort();
    return { products, factories, shippingTimes };
  }, [stationItems]);

  // กรองข้อมูลตาม Filter ทั้ง 5 ช่อง และเรียงตามวันที่ -> เวลาส่ง -> ID
  const filteredItems = useMemo(
    () =>
      stationItems
        .filter(
          (item) =>
            (!filters.product || item.productName === filters.product) &&
            (!filters.factory || item.factory === filters.factory) &&
            (!filters.status || item.status === filters.status) &&
            (!filters.date || item.date === filters.date) &&
            (!filters.shippingTime || item.shippingTime === filters.shippingTime),
        )
        .sort(
          (a, b) =>
            (a.date + a.shippingTime).localeCompare(b.date + b.shippingTime) || a.id - b.id,
        ),
    [stationItems, filters],
  );

  // ถ้า URL ไม่ใช่ 1, 2, 3 ให้ดีดกลับไปหน้า station 1
  if (![1, 2, 3].includes(id)) {
    return <Navigate to="/station/1" replace />;
  }

  const info = STATION_INFO[id];

  // กดปุ่มส่งสินค้า
  const handleSend = (item: ProductionItem, traysInput: string): boolean => {
    if (traysInput.trim() === '') {
      alert('กรุณากรอกจำนวนถาดที่จะส่ง');
      return false;
    }

    const trays = Number(traysInput);
    const maxTrays = getRemainingTrays(item);

    if (
      Number.isNaN(trays) ||
      !Number.isInteger(trays) ||
      trays < 0 ||
      trays > maxTrays ||
      trays > item.totalPieces
    ) {
      alert('จำนวนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      return false;
    }

    const piecesToSend = Math.min(trays * item.piecesPerTray, getRemainingPieces(item));

    alert(
      [
        `ProductName: ${item.productName}`,
        `Shipping Time: ${item.shippingTime} น.`,
        `Factory: ${item.factory}`,
        `จำนวนถาดที่ส่ง: ${trays} ถาด`,
        `จำนวนชิ้นที่ส่ง: ${piecesToSend} ชิ้น`,
        `Station ที่ส่ง: Station ${id}`,
        `เวลาที่ส่ง: ${formatNow()}`,
      ].join('\n'),
    );

    onSent(item.id, piecesToSend);
    return true;
  };

  // กดปุ่มแจ้งปัญหาจาก Popover Modal
  const handleReportSubmit = (item: ProductionItem, issue: IssueType, pieces: number) => {
    alert(
      [
        `ProductName: ${item.productName}`,
        `Shipping Time: ${item.shippingTime} น.`,
        `Factory: ${item.factory}`,
        `จำนวนชิ้นที่มีปัญหา: ${pieces} ชิ้น`,
        `หัวข้อปัญหา: ${issue}`,
        `Station ที่ส่ง: Station ${id}`,
        `เวลาที่ส่ง: ${formatNow()}`,
      ].join('\n'),
    );
  };

  return (
    <div className="mt-6 space-y-6">
      {/* ส่วนหัวแสดงข้อมูลของแต่ละ Station */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="text-4xl p-3 bg-slate-50 rounded-xl border border-slate-100">
          {info.icon}
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800">{info.title}</h2>
          <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
            กำลังทำงาน
          </span>
        </div>
      </div>

      {/* แถบ Filter (Product, Factory, Status, Date, Shipping time) */}
      <FilterBar filters={filters} onChange={setFilters} {...filterOptions} />

      {/* หัวข้อ + ตัวนับรายการ */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">รายการผลิต — Station {id}</h3>
        <span className="text-sm text-slate-500">
          แสดง {filteredItems.length} จาก {stationItems.length} รายการ
        </span>
      </div>

      {/* แสดงรายการ Row Card */}
      <div className="flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm font-medium text-slate-500">ไม่พบรายการที่ตรงกับตัวกรอง</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <RowCard
              key={item.id}
              item={item}
              onSend={handleSend}
              onReportSubmit={handleReportSubmit}
            />
          ))
        )}
      </div>
    </div>
  );
}
