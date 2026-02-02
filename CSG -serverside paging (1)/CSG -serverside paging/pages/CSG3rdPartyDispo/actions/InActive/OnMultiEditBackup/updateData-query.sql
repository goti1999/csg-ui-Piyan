MERGE dbo.Transport_Dispo_clone AS target
USING (VALUES
   ('10229','443226486','443434208',5,
    CAST('2025-09-15T15:22:55.007' AS DATETIME2),
    '478',0,'RWGROTTE',NULL,
    CAST('2025-09-15T15:22:55.007' AS DATETIME2),
    '99999',NULL),
   ('10229','443226486','443434209',6,
    CAST('2025-09-15T15:22:55.007' AS DATETIME2),
    '471',0,NULL,NULL,
    CAST('2025-09-15T15:22:55.007' AS DATETIME2),
    '99999',NULL)
) AS src (
   CustomerID, MBL_ID, ContainerID, Transport_Dispo_ID, ATA_Terminal_Inland,
   DeliveryAddress, Direct_Truck, DropOff_Terminal, DropOff_Terminal_TIR,
   ETA_DeliveryAddress, Pincode, Transport_Mode_final_DeliveryAddress
)
ON target.CustomerID = src.CustomerID
   AND target.MBL_ID = src.MBL_ID
   AND target.ContainerID = src.ContainerID
WHEN MATCHED THEN UPDATE SET 
    Transport_Dispo_ID = src.Transport_Dispo_ID,
    ATA_Terminal_Inland = src.ATA_Terminal_Inland,
    DeliveryAddress = src.DeliveryAddress,
    Direct_Truck = src.Direct_Truck,
    DropOff_Terminal = src.DropOff_Terminal,
    DropOff_Terminal_TIR = src.DropOff_Terminal_TIR,
    ETA_DeliveryAddress = src.ETA_DeliveryAddress,
    Pincode = src.Pincode,
    Transport_Mode_final_DeliveryAddress = src.Transport_Mode_final_DeliveryAddress
WHEN NOT MATCHED THEN
  INSERT (CustomerID, MBL_ID, ContainerID, Transport_Dispo_ID,
          ATA_Terminal_Inland, DeliveryAddress, Direct_Truck,
          DropOff_Terminal, DropOff_Terminal_TIR, ETA_DeliveryAddress,
          Pincode, Transport_Mode_final_DeliveryAddress)
  VALUES (src.CustomerID, src.MBL_ID, src.ContainerID, src.Transport_Dispo_ID,
          src.ATA_Terminal_Inland, src.DeliveryAddress, src.Direct_Truck,
          src.DropOff_Terminal, src.DropOff_Terminal_TIR, src.ETA_DeliveryAddress,
          src.Pincode, src.Transport_Mode_final_DeliveryAddress);
