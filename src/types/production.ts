export type StationId = 1 | 2 | 3;

export type ProductionStatus = 'init' | 'processing' | 'finished';

export const STATUS_LABEL: Record<ProductionStatus, string> = {
  init: 'รอเริ่ม',
  processing: 'กำลังผลิต',
  finished: 'เสร็จสิ้น',
};

export const ISSUE_TYPES = ['วัตถุดิบหมด', 'เครื่องเสีย', 'ไหม้'] as const;
export type IssueType = (typeof ISSUE_TYPES)[number];

/** โครงสร้างข้อมูลดิบจาก src/data/mock-production.json และ mock-product.json */
export interface ProductionJsonRow {
  ID: number;
  CreatedAt: string;
  DeletedAt: string | null;
  product_id: string;
  factory_id: number;
  import_quantity: number;
  lost_quantity: number;
  export_quantity: number;
  status: ProductionStatus;
  station: StationId;
  shipping_time: string;
}

export interface ProductJsonRow {
  id: string;
  name: string;
  piece_per_tray: number;
  station: Record<'1' | '2' | '3', number>;
  DeletedAt: string | null;
}

export interface ProductionItem {
  id: number;
  station: StationId;
  productName: string;
  shippingTime: string;
  factory: string;
  status: ProductionStatus;
  date: string;
  totalPieces: number;    // จำนวนชิ้นทั้งหมด
  producedPieces: number; // จำนวนผลิตได้
  defectPieces: number;   // จำนวนเสีย
  piecesPerTray: number;  // จำนวนชิ้นต่อถาด
  sentPieces: number;     // จำนวนชิ้นที่ส่งไปแล้ว
}

export interface Filters {
  product: string;
  factory: string;
  status: '' | ProductionStatus;
  date: string;
  shippingTime: string;
}

export const EMPTY_FILTERS: Filters = {
  product: '',
  factory: '',
  status: '',
  date: '',
  shippingTime: '',
};

/** จำนวนชิ้นคงเหลือที่ยังไม่ได้ส่ง */
export const getRemainingPieces = (item: ProductionItem): number =>
  Math.max(item.totalPieces - item.sentPieces, 0);

/** จำนวนถาดคงเหลือ */
export const getRemainingTrays = (item: ProductionItem): number =>
  Math.ceil(getRemainingPieces(item) / item.piecesPerTray);
