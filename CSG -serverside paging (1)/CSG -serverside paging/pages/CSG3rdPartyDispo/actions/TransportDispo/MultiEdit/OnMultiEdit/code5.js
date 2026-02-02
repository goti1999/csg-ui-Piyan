let formRows = steps.buildPayload.data;         
const combinedRows = steps.CombinedArray.data || [];

if (!Array.isArray(formRows)) {
  formRows = formRows.rows || [formRows]; 
}

const finalRows = formRows.map(fRow => {
  const cRow = combinedRows.find(c => 
    c.CustomerID === fRow.CustomerID &&
    c.MBL_ID === fRow.MBL_ID &&
    c.ContainerID === fRow.ContainerID
  ) || {};

  return {
    CustomerID: fRow.CustomerID,
    MBL_ID: fRow.MBL_ID,
    ContainerID: fRow.ContainerID,
    Pincode: fRow.Pincode ?? null,
    DropOff_Terminal: fRow.DropOff_Terminal ?? null,
    DropOff_Terminal_TIR: fRow.DropOff_Terminal_TIR ?? null,
    ETA_DeliveryAddress: fRow.ETA_DeliveryAddress ?? null,
    DeliveryAddress: fRow.DeliveryAddress ?? null,
    ATA_Terminal_Inland: cRow.ATA_Terminal_Inland ?? fRow.ATA_Terminal_Inland ?? null,
    Direct_Truck: fRow.Direct_Truck ?? null,
    Transport_Dispo_ID: cRow.transport_Dispo_ID ?? null,
    Remarks: fRow.Remarks ?? cRow.Remarks ?? null,
    Containerverfuegbarkeit: fRow.Containerverfuegbarkeit ?? cRow.Containerverfuegbarkeit ?? null,
  };
});

return finalRows;
