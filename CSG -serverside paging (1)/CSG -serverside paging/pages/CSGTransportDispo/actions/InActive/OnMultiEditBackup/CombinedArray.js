// Assuming step1 output
const step1Output = steps.code.data || {};
const rows = step1Output.rows || [];
let form = step1Output.form || {};

Object.keys(form).forEach(key => {
  if (form[key] === undefined) form[key] = null;
});

const result = rows.map(row => ({
  CustomerID: row.CustomerID,
  MBL_ID: row.MBL_ID,
  ContainerID: row.ContainerID,
  transport_Dispo_ID: row.transport_Dispo_ID,
  ATA_Terminal_Inland: form.ATA_Terminal_Inland,
  DeliveryAddress: form.DeliveryAddress,
  Direct_Truck: form.Direct_Truck,
  DropOff_Terminal: form.DropOff_Terminal,
  DropOff_Terminal_TIR: form.DropOff_Terminal_TIR,
  ETA_DeliveryAddress: form.ETA_DeliveryAddress,
  Pincode: form.Pincode,
  Remarks: form.Remarks,
  Containerverfuegbarkeit: form.Containerverfuegbarkeit,
}));

// Return JSON array
return result;
