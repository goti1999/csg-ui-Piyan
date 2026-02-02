-- Loop through each row from the payload
:param0
DECLARE @DispoID INT = :param1;

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone
        WHERE CustomerID = :param2 
          AND MBL_ID = :param3 
          AND ContainerID = :param4
    )
    BEGIN
        -- UPDATE existing row
        UPDATE dbo.Transport_Dispo_clone
        SET
            Pincode = :param5,
            DropOff_Terminal = :param6,
            DropOff_Terminal_TIR = :param7,
            ETA_DeliveryAddress = :param8,
            DeliveryAddress = :param9,
            ATA_Terminal_Inland = :param10,
            Direct_Truck = :param11,
            Remarks = :param12,
            Containerverfuegbarkeit = :param13
        WHERE CustomerID = :param14 
          AND MBL_ID = :param15 
          AND ContainerID = :param16;
    END
    ELSE
    BEGIN
        -- INSERT new row if it does not exist
        INSERT INTO dbo.Transport_Dispo_clone (
            Transport_Dispo_ID,
            Pincode,
            DropOff_Terminal,
            DropOff_Terminal_TIR,
            ETA_DeliveryAddress,
            DeliveryAddress,
            ATA_Terminal_Inland,
            Direct_Truck,
            Remarks,
            Containerverfuegbarkeit,
            CustomerID,
            MBL_ID,
            ContainerID
        )
        VALUES (
            :param17,
            :param18,
            :param19,
            :param20,
            :param21,
            :param22,
            :param23,
            :param24,
            :param25,
            :param26,
            :param27,
            :param28,
            :param29
        );
    END
END
:param30
