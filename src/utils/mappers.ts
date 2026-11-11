import productionJson from '../data/mock-production.json';
import productJson from '../data/mock-product.json';
import type { ProductJsonRow, ProductionItem, ProductionJsonRow } from '../types/production';

/** อ่านข้อมูลจาก mock-production.json และ mock-product.json มาจับคู่และแปลงเป็นรายการพร้อมใช้งาน */
export function loadProductionItemsFromJson(): ProductionItem[] {
  const productions = (productionJson.data as ProductionJsonRow[]).filter(
    (row) => row.DeletedAt === null,
  );
  const products = (productJson.products as ProductJsonRow[]).filter(
    (product) => product.DeletedAt === null,
  );

  const productMap = new Map(products.map((p) => [p.id, p]));

  return productions.map((row) => {
    const product = productMap.get(row.product_id);
    const stationKey = String(row.station) as '1' | '2' | '3';

    return {
      id: row.ID,
      station: row.station,
      productName: product?.name ?? row.product_id,
      shippingTime: row.shipping_time.slice(0, 5), // "14:00:00" -> "14:00"
      factory: `Factory ${row.factory_id}`,
      status: row.status,
      date: row.CreatedAt.slice(0, 10), // "2025-11-26T08:00:00+07:00" -> "2025-11-26"
      totalPieces: product?.station[stationKey] ?? row.import_quantity,
      producedPieces: row.export_quantity,
      defectPieces: row.lost_quantity,
      piecesPerTray: Math.max(product?.piece_per_tray ?? 1, 1),
      sentPieces: 0,
    };
  });
}
