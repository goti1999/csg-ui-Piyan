DECLARE @DispoID INT = ?;

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone 
        WHERE CustomerID = ? 
          AND MBL_ID = ? 
          AND ContainerID = ?
    )
    BEGIN
        UPDATE dbo.Transport_Dispo_clone 
        SET
            Pincode = ?,
            DropOff_Terminal = ?,
            DropOff_Terminal_TIR = ?,
            ETA_DeliveryAddress = ?,
            DeliveryAddress = ?,
            ATA_Terminal_Inland = ?,
            Direct_Truck = ?,
        
            
        WHERE CustomerID = ? 
          AND MBL_ID = ? 
          AND ContainerID = ?;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.Transport_Dispo_clone (
            Transport_Dispo_ID,
            Pincode,
            DropOff_Terminal,
            DropOff_Terminal_TIR,
            ETA_DeliveryAddress,
            DeliveryAddress,
            ATA_Terminal_Inland,
            Direct_Truck,
            CustomerID,
            MBL_ID,
            ContainerID

        )
        VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
        );
    END
END
