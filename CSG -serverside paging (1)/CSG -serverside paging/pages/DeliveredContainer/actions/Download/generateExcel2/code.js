// Convert ISO string to DD.MM.YYYY HH:mm:ss without timezone conversion
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("T");           // ["2025-09-26","00:00:00.000Z"]
    const dateParts = parts[0].split("-");      // ["2025","09","26"]
    const timeParts = parts[1].split(":");      // ["00","00","00.000Z"]

    const dd = dateParts[2];
    const mm = dateParts[1];
    const yyyy = dateParts[0];
    const hh = timeParts[0];
    const mi = timeParts[1];
    const ss = timeParts[2].split(".")[0];      // remove milliseconds

    return `${dd}.${mm}.${yyyy} ${hh}:${mi}:${ss}`;
  } catch (e) {
    return dateStr;
  }
}

// Get formatted date for filename
function getFileDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

// Map UI Bakery table data
const excelData = {{ui.ontable13.value}}.map(row => ({
  statusOverAll: row.statusOverAll,
  Status_Dispo: row.Status_Dispo,
  Status_Transport: row.Status_Transport,
  Condition: row.Condition,
  MBL_No: row.MBL_No,
  Container_No: row.Container_No,
  TransmissionTimestamp: formatDate(row.TransmissionTimestamp),
  ContainerSize: row.ContainerSize,
  Carrier: row.Carrier,
  Vessel: row.Vessel,
  AdvertFlag: row.AdvertFlag,
  RealAdvertFlag: row.RealAdvertFlag,
  EarliestAdvertDate: formatDate(row.EarliestAdvertDate),
  ETA_PortOfDischarge: formatDate(row.ETA_PortOfDischarge),
  Broker: row.Broker,
  Direct_Truck: row.Direct_Truck,
  ATA_Seaport: formatDate(row.ATA_Seaport),
  PortOfDischarge_UNLOCO: row.PortOfDischarge_UNLOCO,
  Terminal_PortOfDischarge: row.Terminal_PortOfDischarge,
  Pincode: row.Pincode,
  ATD_Pickup_PortOfDischarge: formatDate(row.ATD_Pickup_PortOfDischarge),
  ETA_Terminal_Inland: formatDate(row.ETA_Terminal_Inland),
  ATA_Terminal_Inland: formatDate(row.ATA_Terminal_Inland),
  ETA_DeliveryAddress: formatDate(row.ETA_DeliveryAddress),
  ATA_DeliveryAddress: formatDate(row.ATA_DeliveryAddress),
  Terminal_Inland_Vorgabe_NTL: row.Terminal_Inland_Vorgabe_NTL,
  DeliveryAddress: row.DeliveryAddress,
  DropOff_Terminal: row.DropOff_Terminal,
  DropOff_Terminal_TIR: row.DropOff_Terminal_TIR,
  ATA_DropOff_Terminal: formatDate(row.ATA_DropOff_Terminal),
  Transport_Mode_final_DeliveryAddress: row.Transport_Mode_final_DeliveryAddress,
  Transport_Mode_Terminal: row.Transport_Mode_Terminal,
  Terminal_Inland_CundA: row.Terminal_Inland_CundA,
  Terminal_Inland_CTV: row.Terminal_Inland_CTV
}));

// Create worksheet and workbook
const ws = XLSX.utils.json_to_sheet(excelData, { header: Object.keys(excelData[0]) });
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Container Data");

// Set column widths
const wsCols = Object.keys(excelData[0]).map(() => ({ wpx: 120 }));
ws['!cols'] = wsCols;

// Style header row: light blue fill and bold
const range = XLSX.utils.decode_range(ws['!ref']);
for (let C = range.s.c; C <= range.e.c; ++C) {
  const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
  if (!ws[cellAddress]) continue;
  ws[cellAddress].s = {
    fill: { fgColor: { rgb: "ADD8E6" } }, // light blue
    font: { bold: true }
  };
}

// Optional: add autofilter
//ws['!autofilter'] = { ref: XLSX.utils.encode_range(ws['!ref']) };

// Save Excel file with dynamic date
const fileName = `CundA_ContainerData_${getFileDate()}.xlsx`;
XLSX.writeFile(wb, fileName);
