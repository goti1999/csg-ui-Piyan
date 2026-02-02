DECLARE @SelectedRows TABLE (
    CustomerID NVARCHAR(50),
    MBL_ID NVARCHAR(50),
    ContainerID NVARCHAR(50)
);

-- Insert multiple selected rows
INSERT INTO @SelectedRows (CustomerID, MBL_ID, ContainerID)
SELECT 
    value.CustomerID,
    value.MBL_ID,
    value.ContainerID
FROM OPENJSON(?) 
WITH (
     CustomerID NVARCHAR(50) '$.CustomerID',
    MBL_ID NVARCHAR(50) '$.MBL_ID',
    ContainerID NVARCHAR(50) '$.ContainerID'
) AS value;

DECLARE @Pincode NVARCHAR(50) = ?;
DECLARE @DropOff_Terminal NVARCHAR(50) = ?;
DECLARE @DropOff_Terminal_TIR NVARCHAR(50) =  ?;
DECLARE @ETA_DeliveryAddress DATETIME =  ?;
DECLARE @DeliveryAddress NVARCHAR(50) =  ?;
DECLARE @ATA_Terminal_Inland DATETIME =  ?;
DECLARE @Transport_Mode_final_DeliveryAddress NVARCHAR(50) =  ?;
DECLARE @Direct_Truck BIT =
 CASE 
        WHEN ? IN ('true','1') THEN 1
        WHEN ? IN ('false','0','') THEN 0
        ELSE NULL
 END;

-- Step 4: Merge to update or insert
MERGE dbo.Transport_Dispo_clone AS target
USING (
    SELECT 
        s.CustomerID, 
        s.MBL_ID, 
        s.ContainerID,
        @Pincode AS Pincode,
        @DropOff_Terminal AS DropOff_Terminal,
        @DropOff_Terminal_TIR AS DropOff_Terminal_TIR,
        @ETA_DeliveryAddress AS ETA_DeliveryAddress,
        @DeliveryAddress AS DeliveryAddress,
        @ATA_Terminal_Inland AS ATA_Terminal_Inland,
        @Transport_Mode_final_DeliveryAddress AS Transport_Mode_final_DeliveryAddress,
        @Direct_Truck AS Direct_Truck
    FROM @SelectedRows s
) AS source
ON target.CustomerID = source.CustomerID
   AND target.MBL_ID = source.MBL_ID
   AND target.ContainerID = source.ContainerID
WHEN MATCHED THEN
    UPDATE SET
        Pincode = ISNULL(source.Pincode, target.Pincode),
        DropOff_Terminal = ISNULL(source.DropOff_Terminal, target.DropOff_Terminal),
        DropOff_Terminal_TIR = ISNULL(source.DropOff_Terminal_TIR, target.DropOff_Terminal_TIR),
        ETA_DeliveryAddress = ISNULL(source.ETA_DeliveryAddress, target.ETA_DeliveryAddress),
        DeliveryAddress = ISNULL(source.DeliveryAddress, target.DeliveryAddress),
        ATA_Terminal_Inland = ISNULL(source.ATA_Terminal_Inland, target.ATA_Terminal_Inland),
        Transport_Mode_final_DeliveryAddress = ISNULL(source.Transport_Mode_final_DeliveryAddress, target.Transport_Mode_final_DeliveryAddress),
        Direct_Truck = ISNULL(source.Direct_Truck, target.Direct_Truck)
WHEN NOT MATCHED BY TARGET THEN
    INSERT (
        CustomerID, MBL_ID, ContainerID, 
        Pincode, DropOff_Terminal, DropOff_Terminal_TIR,
        ETA_DeliveryAddress, DeliveryAddress, ATA_Terminal_Inland,
        Transport_Mode_final_DeliveryAddress, Direct_Truck
    )
    VALUES (
        source.CustomerID, source.MBL_ID, source.ContainerID, 
        source.Pincode, source.DropOff_Terminal, source.DropOff_Terminal_TIR,
        source.ETA_DeliveryAddress, source.DeliveryAddress, source.ATA_Terminal_Inland,
        source.Transport_Mode_final_DeliveryAddress, source.Direct_Truck
    );
   