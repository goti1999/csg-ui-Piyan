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
FROM OPENJSON({{steps.code2.data}}) 
WITH (
    CustomerID NVARCHAR(50),
    MBL_ID NVARCHAR(50),
    ContainerID NVARCHAR(50)
) AS value;

DECLARE @Pincode NVARCHAR(50) = {{ui.MultiEditform9.value.Pincode}};
DECLARE @DropOff_Terminal NVARCHAR(50) = ('{{ui.MultiEditform9.value.DropOff_Terminal}}','');;
DECLARE @DropOff_Terminal_TIR NVARCHAR(50) = {{ui.MultiEditform9.value.DropOff_Terminal_TIR}};
DECLARE @ETA_DeliveryAddress DATETIME = {{ moment(ui.MultiEditform9.value.ETA_DeliveryAddress).toISOString() }};
DECLARE @DeliveryAddress NVARCHAR(50) = {{ui.MultiEditform9.value.DeliveryAddress}};
DECLARE @ATA_Terminal_Inland DATETIME = {{ moment(ui.MultiEditform9.value.ATA_Terminal_Inland).toISOString() }};
DECLARE @Transport_Mode_final_DeliveryAddress NVARCHAR(50) = {{ui.MultiEditform9.value.Transport_Mode_final_DeliveryAddress}};
DECLARE @Direct_Truck BIT = {{ui.MultiEditform9.value.Direct_Truck}}


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
        Pincode = source.Pincode,
        DropOff_Terminal = source.DropOff_Terminal,
        DropOff_Terminal_TIR = source.DropOff_Terminal_TIR,
        ETA_DeliveryAddress = source.ETA_DeliveryAddress,
        DeliveryAddress = source.DeliveryAddress,
        ATA_Terminal_Inland = source.ATA_Terminal_Inland,
        Transport_Mode_final_DeliveryAddress = source.Transport_Mode_final_DeliveryAddress,
        Direct_Truck = source.Direct_Truck
WHEN NOT MATCHED BY TARGET THEN
    INSERT (
        CustomerID, MBL_ID, ContainerID, Pincode, DropOff_Terminal, DropOff_Terminal_TIR,
        ETA_DeliveryAddress, DeliveryAddress, ATA_Terminal_Inland,
        Transport_Mode_final_DeliveryAddress, Direct_Truck
    )
    VALUES (
        source.CustomerID, source.MBL_ID, source.ContainerID, source.Pincode, source.DropOff_Terminal, source.DropOff_Terminal_TIR,
        source.ETA_DeliveryAddress, source.DeliveryAddress, source.ATA_Terminal_Inland,
        source.Transport_Mode_final_DeliveryAddress, source.Direct_Truck
    );