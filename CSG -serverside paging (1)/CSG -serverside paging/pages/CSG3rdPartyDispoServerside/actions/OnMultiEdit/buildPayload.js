// Parse your variables (stored as JSON strings)
const customers = JSON.parse(state.RowCustomerID || "[]");
const mbls = JSON.parse(state.RowMBL_ID || "[]");
const containers = JSON.parse(state.RowContainerID || "[]");

// Get form values
const form = ui.MultiEditform.value || {};

// Build array of objects for each row to update/insert
const payload = customers.map((c, i) => ({
  CustomerID: c,
  MBL_ID: mbls[i],
  ContainerID: containers[i],
  transport_Dispo_ID: form.transport_Dispo_ID || null,
  ATA_Terminal_Inland: form.ATA_Terminal_Inland || null,
  DeliveryAddress: form.DeliveryAddress || null,
  Direct_Truck: form.Direct_Truck || null,
  DropOff_Terminal: form.DropOff_Terminal || null,
  DropOff_Terminal_TIR: form.DropOff_Terminal_TIR || null,
  ETA_DeliveryAddress: form.ETA_DeliveryAddress || null,
  Pincode: form.Pincode || null,
  Remarks: form.Remarks || null,
  Containerverfuegbarkeit: form.Containerverfuegbarkeit || null
}));

return payload; // You can inspect it in the UI Bakery debug panel
