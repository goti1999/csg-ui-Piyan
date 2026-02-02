(() => {
  const selectedRows = ui.ontable13.selectedRows?.data || [];
  const form = ui.MultiEditform12?.value || {};

  if (selectedRows.length === 0) {
    console.warn("No selected rows found.");
    return [];
  }

  const payload = selectedRows.map((row) => ({
    CustomerID: row.CustomerID,
    MBL_ID: row.MBL_ID,
    ContainerID: row.ContainerID,
    transport_Dispo_ID: form.transport_Dispo_ID ?? row.transport_Dispo_ID ?? null,
    ATA_Terminal_Inland: form.ATA_Terminal_Inland ?? row.ATA_Terminal_Inland ?? null,
    DeliveryAddress: form.DeliveryAddress ?? row.DeliveryAddress ?? null,
    Direct_Truck: form.Direct_Truck ?? row.Direct_Truck ?? null,
    DropOff_Terminal: form.DropOff_Terminal ?? row.DropOff_Terminal ?? null,
    DropOff_Terminal_TIR: form.DropOff_Terminal_TIR ?? row.DropOff_Terminal_TIR ?? null,
    ETA_DeliveryAddress: form.ETA_DeliveryAddress ?? row.ETA_DeliveryAddress ?? null,
    Pincode: form.Pincode ?? row.Pincode ?? null,
    Remarks: form.Remarks ?? row.Remarks ?? null,
    Containerverfuegbarkeit: form.Containerverfuegbarkeit ?? row.Containerverfuegbarkeit ?? null,
    to_Transporter: row.to_Transporter ?? null
  }));

  return payload;
})();
