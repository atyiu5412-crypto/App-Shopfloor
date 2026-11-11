import { useState } from 'react';
import {
  getRemainingPieces,
  getRemainingTrays,
  STATUS_LABEL,
  type IssueType,
  type ProductionItem,
  type ProductionStatus,
} from '../types/production';
import IssuePopoverModal from './IssuePopoverModal';

interface Props {
  item: ProductionItem;
  onSend: (item: ProductionItem, traysInput: string) => boolean;
  onReportSubmit: (item: ProductionItem, issue: IssueType, pieces: number) => void;
}

const STATUS_DOT: Record<ProductionStatus, string> = {
  init: 'text-slate-500',
  processing: 'text-blue-600',
  finished: 'text-emerald-600',
};

export default function RowCard({ item, onSend, onReportSubmit }: Props) {
  const [traysInput, setTraysInput] = useState('');

  // ID เฉพาะตัวของแต่ละ Card สำหรับ Popover Modal
  const modalId = `issue-modal-${item.id}`;

  const remainingTrays = getRemainingTrays(item);
  const remainingPieces = getRemainingPieces(item);

  const producedPct =
    item.totalPieces > 0
      ? Math.round((item.producedPieces / item.totalPieces) * 100)
      : 0;

  const defectPct =
    item.totalPieces > 0
      ? ((item.defectPieces / item.totalPieces) * 100).toFixed(1)
      : '0.0';

  const num = Number(traysInput);
  const isInvalid =
    traysInput !== '' &&
    (Number.isNaN(num) || !Number.isInteger(num) || num < 0 || num > remainingTrays);

  const handleSendClick = () => {
    const success = onSend(item, traysInput);
    if (success) {
      setTraysInput('');
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-stretch divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
        
        {/* ส่วนซ้าย: ชื่อสินค้า, Shipping Time, Factory, Input ถาด + ปุ่มส่งสินค้า + ปุ่มแจ้งปัญหา (popoverTarget) */}
        <div className="lg:w-[360px] xl:w-[400px] shrink-0 p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3
                className="text-base font-bold text-slate-900 leading-snug line-clamp-1"
                title={item.productName}
              >
                {item.productName}
              </h3>
              <span className={`shrink-0 text-[11px] font-semibold ${STATUS_DOT[item.status]}`}>
                ● {STATUS_LABEL[item.status]}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Shipping {item.shippingTime} น. · {item.factory} · {item.date}
            </p>
          </div>

          {/* แถวปุ่ม Action */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-28">
                <input
                  type="number"
                  min={0}
                  max={remainingTrays}
                  step={1}
                  value={traysInput}
                  onChange={(e) => setTraysInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
                  placeholder="จำนวน"
                  aria-label="จำนวนสินค้าที่จะส่งเป็นจำนวนถาด"
                  className={`w-full rounded-full border px-3.5 py-1.5 pr-9 text-xs font-semibold focus:outline-none focus:ring-2 transition ${
                    isInvalid
                      ? 'border-rose-400 text-rose-600 focus:ring-rose-100'
                      : 'border-slate-300 text-slate-800 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-400">
                  ถาด
                </span>
              </div>

              <button
                type="button"
                onClick={handleSendClick}
                className="rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold px-5 py-2 shadow-xs transition cursor-pointer"
              >
                ส่งสินค้า
              </button>

              {/* ปุ่มเปิด Popover Modal ด้วย popoverTarget */}
              <button
                type="button"
                popoverTarget={modalId}
                className="rounded-full px-3 py-2 text-xs font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
              >
                แจ้งปัญหา
              </button>
            </div>

            {isInvalid && (
              <p className="mt-1.5 text-[11px] font-medium text-rose-500 pl-1">
                กรุณากรอกระหว่าง 0 – {remainingTrays} ถาด
              </p>
            )}
          </div>
        </div>

        {/* ส่วนขวา: 4 ช่อง KPI Metrics */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold text-slate-400">
              • เป้าหมาย #{item.id}
            </span>
            <span className="mt-1 text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
              {item.totalPieces.toLocaleString()}
            </span>
            <span className="mt-1 text-xs text-slate-500">จำนวนชิ้นทั้งหมด</span>
          </div>

          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold text-emerald-600">
              ↑ {producedPct}%
            </span>
            <span className="mt-1 text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
              {item.producedPieces.toLocaleString()}
            </span>
            <span className="mt-1 text-xs text-slate-500">จำนวนผลิตได้</span>
          </div>

          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span
              className={`text-[11px] font-semibold ${
                item.defectPieces > 0 ? 'text-rose-500' : 'text-emerald-600'
              }`}
            >
              {item.defectPieces > 0 ? `↓ ${defectPct}%` : '✓ 0%'}
            </span>
            <span className="mt-1 text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
              {item.defectPieces.toLocaleString()}
            </span>
            <span className="mt-1 text-xs text-slate-500">จำนวนเสีย</span>
          </div>

          <div className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold text-indigo-600">
              เหลือ {remainingPieces} ชิ้น ({item.piecesPerTray}/ถาด)
            </span>
            <span className="mt-1 text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
              {remainingTrays.toLocaleString()}
            </span>
            <span className="mt-1 text-xs text-slate-500">จำนวนถาด</span>
          </div>
        </div>

      </div>

      {/* Popover Modal แจ้งปัญหา (ID เฉพาะของแต่ละ Card) */}
      <IssuePopoverModal
        modalId={modalId}
        item={item}
        onReportSubmit={onReportSubmit}
      />
    </article>
  );
}
