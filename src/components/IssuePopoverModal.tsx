import { useRef, useState } from 'react';
import {
  ISSUE_TYPES,
  type IssueType,
  type ProductionItem,
} from '../types/production';

interface Props {
  modalId: string;
  item: ProductionItem;
  onReportSubmit: (item: ProductionItem, issue: IssueType, pieces: number) => void;
}

export default function IssuePopoverModal({ modalId, item, onReportSubmit }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [issue, setIssue] = useState<IssueType | ''>('');
  const [piecesInput, setPiecesInput] = useState('');

  const num = Number(piecesInput);
  let error = '';
  if (piecesInput !== '') {
    if (!Number.isInteger(num) || num <= 0) {
      error = 'จำนวนต้องเป็นจำนวนเต็มมากกว่า 0';
    } else if (num > item.totalPieces) {
      error = `จำนวนต้องไม่เกินจำนวนชิ้นทั้งหมด (${item.totalPieces.toLocaleString()} ชิ้น)`;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!issue) {
      alert('กรุณาเลือกหัวข้อปัญหา');
      return;
    }
    if (piecesInput.trim() === '') {
      alert('กรุณากรอกจำนวนชิ้นที่มีปัญหา');
      return;
    }
    if (!Number.isInteger(num) || num <= 0 || num > item.totalPieces) {
      alert('จำนวนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    onReportSubmit(item, issue, num);

    // ปิด Popover Modal และรีเซ็ตค่าฟอร์ม
    modalRef.current?.hidePopover();
    setIssue('');
    setPiecesInput('');
  };

  const handleToggle = (e: React.ToggleEvent<HTMLDivElement>) => {
    if (e.newState === 'closed') {
      setIssue('');
      setPiecesInput('');
    }
  };

  return (
    <div
      ref={modalRef}
      className="modal"
      id={modalId}
      popover="auto"
      onToggle={handleToggle}
    >
      <div className="modal-box max-w-md bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xl">
        {/* ส่วนหัว Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span>⚠️</span>
            <span>แจ้งปัญหาการผลิต</span>
          </h3>
          <button
            type="button"
            popoverTarget={modalId}
            popoverTargetAction="hide"
            className="btn btn-sm btn-circle btn-ghost text-slate-400"
            aria-label="ปิดหน้าต่าง"
          >
            ✕
          </button>
        </div>

        {/* รายละเอียดสินค้าที่แจ้ง */}
        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-600">
          <p className="font-bold text-sm text-slate-800">{item.productName}</p>
          <p className="mt-1">
            {item.factory} · Shipping {item.shippingTime} น. · ทั้งหมด {item.totalPieces.toLocaleString()} ชิ้น
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          {/* Select หัวข้อปัญหา */}
          <label className="form-control w-full block">
            <span className="label-text text-xs font-bold text-slate-700 block mb-1.5">
              หัวข้อปัญหา <span className="text-rose-500">*</span>
            </span>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value as IssueType)}
              className="select select-bordered w-full bg-white text-sm text-slate-800 border-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="" disabled>
                -- เลือกหัวข้อปัญหา --
              </option>
              {ISSUE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          {/* Input กรอกจำนวน(ชิ้น) */}
          <label className="form-control w-full block">
            <span className="label-text text-xs font-bold text-slate-700 block mb-1.5">
              จำนวน (ชิ้น) <span className="text-rose-500">*</span>
            </span>
            <input
              type="number"
              min={1}
              max={item.totalPieces}
              step={1}
              value={piecesInput}
              onChange={(e) => setPiecesInput(e.target.value)}
              placeholder={`กรอก 1 – ${item.totalPieces}`}
              className={`input input-bordered w-full bg-white text-sm text-slate-800 focus:outline-none ${
                error
                  ? 'border-rose-400 focus:border-rose-500 text-rose-700'
                  : 'border-slate-300 focus:border-indigo-500'
              }`}
            />
            {error && <span className="text-xs text-rose-500 mt-1 block font-medium">{error}</span>}
          </label>

          {/* ปุ่มแจ้งปัญหา & ปุ่มปิด Modal */}
          <div className="modal-action pt-2">
            <button
              type="button"
              popoverTarget={modalId}
              popoverTargetAction="hide"
              className="btn btn-sm btn-ghost border border-slate-300 text-slate-600"
            >
              ปิด Modal
            </button>
            <button
              type="submit"
              className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white border-none px-5"
            >
              แจ้งปัญหา
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

