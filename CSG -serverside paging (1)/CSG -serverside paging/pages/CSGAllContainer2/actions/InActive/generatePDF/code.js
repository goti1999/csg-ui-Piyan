const doc = new jspdf.jsPDF("l", "pt", "a3"); // l = landscape, pt = points, a4 = paper size

// format datetime helper
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr; // return as-is if not valid
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  } catch (e) {
    return dateStr;
  }
}

// table headers
const head = [[
  "statusOverAll",
  "Status_Dispo",
  "Status_Transport",
  "Condition",
  "MBL_No",
  "Container_No",
  "TransmissionTimestamp",
  "ContainerSize",
  "Carrier",
  "Vessel",
  "AdvertFlag",
  "RealAdvertFlag",
  "EarliestAdvertDate",
  "ETA_PortOfDischarge",
  "Broker",
  "Direct_Truck",
  "ATA_Seaport",
  "PortOfDischarge_UNLOCO",
  "Terminal_PortOfDischarge",
  "Pincode",
  "ATD_Pickup_PortOfDischarge",
  "ETA_Terminal_Inland",
  "ATA_Terminal_Inland",
  "ETA_DeliveryAddress",
  "ATA_DeliveryAddress",
  "Terminal_Inland_Vorgabe_NTL",
  "DeliveryAddress",
  "DropOff_Terminal",
  "DropOff_Terminal_TIR",
  "ATA_DropOff_Terminal",
  "Transport_Mode_final_DeliveryAddress",
  "Transport_Mode_Terminal",
  "Terminal_Inland_CundA",
  "Terminal_Inland_CTV"
]];

// table body from UI Bakery table data
const body = {{ui.ontable9.value}}.map(row => ([
  row.statusOverAll,
  row.Status_Dispo,
  row.Status_Transport,
  row.Condition,
  row.MBL_No,
  row.Container_No,
  formatDate(row.TransmissionTimestamp),
  row.ContainerSize,
  row.Carrier,
  row.Vessel,
  row.AdvertFlag,
  row.RealAdvertFlag,
  formatDate(row.EarliestAdvertDate),
  formatDate(row.ETA_PortOfDischarge),
  row.Broker,
  row.Direct_Truck,
  formatDate(row.ATA_Seaport),
  row.PortOfDischarge_UNLOCO,
  row.Terminal_PortOfDischarge,
  row.Pincode,
  formatDate(row.ATD_Pickup_PortOfDischarge),
  formatDate(row.ETA_Terminal_Inland),
  formatDate(row.ATA_Terminal_Inland),
  formatDate(row.ETA_DeliveryAddress),
  formatDate(row.ATA_DeliveryAddress),
  row.Terminal_Inland_Vorgabe_NTL,
  row.DeliveryAddress,
  row.DropOff_Terminal,
  row.DropOff_Terminal_TIR,
  formatDate(row.ATA_DropOff_Terminal),
  row.Transport_Mode_final_DeliveryAddress,
  row.Transport_Mode_Terminal,
  row.Terminal_Inland_CundA,
  row.Terminal_Inland_CTV
]));

// build table
doc.autoTable({
  head,
  body,
  startY: 30,
  styles: { fontSize: 6, cellWidth: "wrap", overflow: "linebreak" },
  headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
  theme: "grid",
  tableWidth: "wrap", // makes table fit to page width
  margin: { top: 30, left: 10, right: 10 },
  didDrawPage: function (data) {
    doc.setFontSize(10);
    doc.text("Container Data Export", data.settings.margin.left, 20);
  }
});

// download pdf
doc.save("container-data.pdf");
