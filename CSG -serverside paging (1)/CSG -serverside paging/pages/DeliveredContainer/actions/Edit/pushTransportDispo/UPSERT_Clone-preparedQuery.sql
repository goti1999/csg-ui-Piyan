DECLARE @DispoID INT = :param0;

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone 
        WHERE CustomerID = :param1 
          AND MBL_ID = :param2 
          AND ContainerID = :param3
    )
    BEGIN
        UPDATE dbo.Transport_Dispo_clone 
        SET
            Pincode = :param4,
            DropOff_Terminal = :param5,
            DropOff_Terminal_TIR = :param6,
            ETA_DeliveryAddress = :param7,
            Remarks = :param8,
            DeliveryAddress = :param9,
            ATA_Terminal_Inland = :param10,
            Containerverfuegbarkeit = :param11,
            Direct_Truck = :param12,
            TransmissionTimestamp = ':param13',
            to_Transporter = :param14
        WHERE CustomerID = :param15 
          AND MBL_ID = :param16 
          AND ContainerID = :param17;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.Transport_Dispo_clone (
            Transport_Dispo_ID,
            Pincode,
            DropOff_Terminal,
            DropOff_Terminal_TIR,
            ETA_DeliveryAddress,
            Remarks,
            DeliveryAddress,
            ATA_Terminal_Inland,
            Containerverfuegbarkeit,
            Direct_Truck,
            TransmissionTimestamp,
            CustomerID,
            MBL_ID,
            ContainerID,
            to_Transporter
        )
        VALUES (
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
            ':param28',
            :param29,
            :param30,
            :param31,
            :param32
        );
    END
END
