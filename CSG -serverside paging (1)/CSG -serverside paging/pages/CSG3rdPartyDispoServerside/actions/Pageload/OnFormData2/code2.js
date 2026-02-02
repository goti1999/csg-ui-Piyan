(() => {
  const row = ui.ontable8.selectedRow?.data || {};

  // helper functions
  const sanitize = (value, defaultVal = null) => value ?? defaultVal;
  const safeDate = (date) => date ? new Date(date).toISOString() : null;

  return {
    // Mandatory fields
    CustomerID: sanitize(row.CustomerID),
    MBL_ID: sanitize(row.MBL_ID),
    ContainerID: sanitize(row.ContainerID),
    transport_Dispo_ID: sanitize(row.transport_Dispo_ID),
    Status_Dispo: sanitize(row.Status_Dispo,),
    MBL_No: sanitize(row.MBL_No),
    Container_No: sanitize(row.Container_No),
    

    // Optional fields
    Pincode: sanitize(row.Pincode, ""),
    DropOff_Terminal: sanitize(row.DropOff_Terminal, ""),
    DropOff_Terminal_TIR: sanitize(row.DropOff_Terminal_TIR, ""),
    Remarks: sanitize(row.Remarks, ""),
    DeliveryAddress: sanitize(row.DeliveryAddress, ""),
    ContainerSize: sanitize(row.ContainerSize, null),
    Carrier: sanitize(row.Carrier, null),
    Vessel: sanitize(row.Vessel, null),
    Transport_Mode_final_DeliveryAddress: sanitize(row.Transport_Mode_final_DeliveryAddress, ""),
    Direct_Truck: sanitize(row.Direct_Truck, ""),
    to_Transporter: sanitize(row.to_Transporter, 0),

    // Date fields
    ETA_DeliveryAddress: safeDate(row.ETA_DeliveryAddress),
    ATA_Terminal_Inland: safeDate(row.ATA_Terminal_Inland),
    Containerverfuegbarkeit: safeDate(row.Containerverfuegbarkeit)
  };
})();
