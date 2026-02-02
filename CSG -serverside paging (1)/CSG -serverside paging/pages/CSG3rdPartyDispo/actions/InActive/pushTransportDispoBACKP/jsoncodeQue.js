const selected = ui.onTableloadTable2.selectedRows;

if (!selected || !Array.isArray(selected.data)) {
  console.warn("No rows selected or invalid structure.");
  return "[]"; // Return empty JSON array string
}

const payloadArray = selected.data.map(row => {
  const baseFields = {
    CustomerID: row.CustomerID,
    MBL_ID: row.MBL_ID,
    ContainerID: row.ContainerID,
    MBL_Number: row.MBL_Number,
    Container_Number: row.Container_Number,
    Status: row.Status,
    Timestamp: row.Timestamp,
    User: row.User,
    direction: row.direction,
    Relation: row.Relation,
    Interface: row.Interface,
    Transport_Dispo_ID: row.Transport_Dispo_ID,
    ContainerSize: row.ContainerSize,
    Carrier: row.Carrier,
    Vessel: row.Vessel,
    Pincode: row.Pincode,
    DropOff_Terminal: row.DropOff_Terminal,
    DropOff_Terminal_TIR: row.DropOff_Terminal_TIR,
    ETA_DeliveryAddress: row.ETA_DeliveryAddress,
    Remarks: row.Remarks,
    DeliveryAddress: row.DeliveryAddress,
    ATA_Terminal_Inland: row.ATA_Terminal_Inland,
    Containerverfuegbarkeit: row.Containerverfuegbarkeit,
    Transport_Mode_final_DeliveryAddress: row.Transport_Mode_final_DeliveryAddress,
    Direct_Truck: row.Direct_Truck,
    to_Transporter: row.to_Transporter,
    TransmissionTimestamp: row.TransmissionTimestamp
  };

  // Build with Info first if conditions match
  if (row.Interface === "ui" && row.Direct_Truck === true) {
    return {
      Info: "Achtung Direct_Truck gewechselt", // ⚠️ First field
      ...baseFields
    };
  }

  return baseFields;
});

// Pretty-printed JSON string output
const jsonString = JSON.stringify(payloadArray, null, 2);

return jsonString;
