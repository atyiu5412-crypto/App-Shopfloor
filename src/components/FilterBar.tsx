import type { Filters, ProductionStatus } from '../types/production';
import { EMPTY_FILTERS, STATUS_LABEL } from '../types/production';

interface Props {
  filters: Filters;
  onChange: (newFilters: Filters) => void;
  products?: string[];
  factories?: string[];
  shippingTimes?: string[];
}

const DEFAULT_PRODUCTS = ['ขนมปังไส้ถั่วแดง', 'ขนมปังไส้สังขยา', 'ครัวซองต์เนยสด', 'เดนิชผลไม้' , 'ขนมปังเน่า' ,];
const DEFAULT_FACTORIES = ['Factory 1', 'Factory 2'];
const DEFAULT_SHIPPING_TIMES = ['14:00', '17:00'];

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';

export default function FilterBar({
  filters,
  onChange,
  products = DEFAULT_PRODUCTS,
  factories = DEFAULT_FACTORIES,
  shippingTimes = DEFAULT_SHIPPING_TIMES,
}: Props) {
  const handleChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilter = Object.values(filters).some(Boolean);

  return (
    <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Product */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">Product</span>
          <select
            className={inputClass}
            value={filters.product}
            onChange={(e) => handleChange('product', e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {products.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        {/* 2. Factory */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">Factory</span>
          <select
            className={inputClass}
            value={filters.factory}
            onChange={(e) => handleChange('factory', e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {factories.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        {/* 3. Status */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">Status</span>
          <select
            className={inputClass}
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value as '' | ProductionStatus)}
          >
            <option value="">ทั้งหมด</option>
            {(Object.keys(STATUS_LABEL) as ProductionStatus[]).map((statusKey) => (
              <option key={statusKey} value={statusKey}>
                {STATUS_LABEL[statusKey]}
              </option>
            ))}
          </select>
        </label>

        {/* 4. Date */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">Date</span>
          <input
            type="date"
            className={inputClass}
            value={filters.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </label>

        {/* 5. Shipping time */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500">Shipping time</span>
          <select
            className={inputClass}
            value={filters.shippingTime}
            onChange={(e) => handleChange('shippingTime', e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {shippingTimes.map((time) => (
              <option key={time} value={time}>
                {time} น.
              </option>
            ))}
          </select>
        </label>

        {/* ปุ่มล้างตัวกรอง */}
        <div className="flex items-end">
          <button
            type="button"
            disabled={!hasActiveFilter}
            onClick={() => onChange(EMPTY_FILTERS)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>
    </section>
  );
}

