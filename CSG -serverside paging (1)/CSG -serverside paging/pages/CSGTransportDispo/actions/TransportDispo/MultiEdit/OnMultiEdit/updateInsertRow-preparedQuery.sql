IF EXISTS (
    SELECT 1 
    FROM dbo.Transport_Dispo_clone
    WHERE CustomerID = :param0
      AND MBL_ID = :param1
      AND ContainerID = :param2
) 
BEGIN
    UPDATE dbo.Transport_Dispo_clone
    SET
        transport_Dispo_ID = :param3,
        Pincode = :param4,
        DropOff_Terminal = :param5,
        DropOff_Terminal_TIR = :param6,
        ETA_DeliveryAddress = :param7,
        DeliveryAddress = :param8,
        ATA_Terminal_Inland = :param9,
        Direct_Truck = :param10,
        Remarks = :param11,
        Containerverfuegbarkeit = :param12
    WHERE CustomerID = :param13
      AND MBL_ID = :param14
      AND ContainerID = :param15;
END
ELSE
BEGIN
    INSERT INTO dbo.Transport_Dispo_clone (
        CustomerID, MBL_ID, ContainerID, transport_Dispo_ID,
        Pincode, DropOff_Terminal, DropOff_Terminal_TIR,
        ETA_DeliveryAddress, DeliveryAddress, ATA_Terminal_Inland,
        Direct_Truck, Remarks, Containerverfuegbarkeit
    )
    VALUES (
        :param16, :param17, :param18, :param19,
        :param20, :param21, :param22,
        :param23, :param24, :param25,
        :param26, :param27, :param28
    );
END
