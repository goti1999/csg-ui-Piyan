// Step 2: Generate queries for each row
const rows = steps.code8.data || [];

const queries = rows.map(r => ({
  query: `
IF EXISTS (
    SELECT 1 FROM dbo.Transport_Dispo_clone
    WHERE CustomerID = ? AND MBL_ID = ? AND ContainerID = ?
)
BEGIN
    UPDATE dbo.Transport_Dispo_clone
    SET Transport_Dispo_ID = ?, ATA_Terminal_Inland = ?, DeliveryAddress = ?,
        Direct_Truck = ?, DropOff_Terminal = ?, DropOff_Terminal_TIR = ?, 
        ETA_DeliveryAddress = ?, Pincode = ?, Transport_Mode_final_DeliveryAddress = ?
    WHERE CustomerID = ? AND MBL_ID = ? AND ContainerID = ?;
END
ELSE
BEGIN
    INSERT INTO dbo.Transport_Dispo_clone (
        CustomerID, MBL_ID, ContainerID, Transport_Dispo_ID, ATA_Terminal_Inland,
        DeliveryAddress, Direct_Truck, DropOff_Terminal, DropOff_Terminal_TIR,
        ETA_DeliveryAddress, Pincode, Transport_Mode_final_DeliveryAddress
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
END
  `,
  params: [
    r.CustomerID, r.MBL_ID, r.ContainerID,
    r.Transport_Dispo_ID, r.ATA_Terminal_Inland, r.DeliveryAddress,
    r.Direct_Truck ? 1 : 0, r.DropOff_Terminal || '', r.DropOff_Terminal_TIR || null,
    r.ETA_DeliveryAddress, r.Pincode, r.Transport_Mode_final_DeliveryAddress || null,
    r.CustomerID, r.MBL_ID, r.ContainerID,
    r.CustomerID, r.MBL_ID, r.ContainerID,
    r.Transport_Dispo_ID, r.ATA_Terminal_Inland, r.DeliveryAddress,
    r.Direct_Truck ? 1 : 0, r.DropOff_Terminal || '', r.DropOff_Terminal_TIR || null,
    r.ETA_DeliveryAddress, r.Pincode, r.Transport_Mode_final_DeliveryAddress || null
  ]
}));

return queries;
