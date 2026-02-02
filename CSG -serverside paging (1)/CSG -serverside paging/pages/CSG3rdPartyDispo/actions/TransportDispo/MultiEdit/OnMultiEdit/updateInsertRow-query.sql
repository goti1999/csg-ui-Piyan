IF EXISTS (
    SELECT 1 
    FROM dbo.Transport_Dispo_clone
    WHERE CustomerID = {{state.RowCustomerID}}
      AND MBL_ID = {{state.RowMBL_ID}}
      AND ContainerID = {{state.RowContainerID}}
) 
BEGIN
    UPDATE dbo.Transport_Dispo_clone
    SET
        transport_Dispo_ID = {{transport_Dispo_ID}},
        Pincode = {{Pincode}},
        DropOff_Terminal = {{DropOff_Terminal}},
        DropOff_Terminal_TIR = {{DropOff_Terminal_TIR}},
        ETA_DeliveryAddress = {{moment(ETA_DeliveryAddress).toISOString()}},
        DeliveryAddress = {{DeliveryAddress}},
        ATA_Terminal_Inland = {{moment(ATA_Terminal_Inland).toISOString()}},
        Direct_Truck = {{Direct_Truck}},
        Remarks = {{Remarks}},
        Containerverfuegbarkeit = {{Containerverfuegbarkeit}}
    WHERE CustomerID = {{CustomerID}}
      AND MBL_ID = {{MBL_ID}}
      AND ContainerID = {{ContainerID}};
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
        {{CustomerID}}, {{MBL_ID}}, {{ContainerID}}, {{transport_Dispo_ID}},
        {{Pincode}}, {{DropOff_Terminal}}, {{DropOff_Terminal_TIR}},
        {{moment(ETA_DeliveryAddress).toISOString()}}, {{DeliveryAddress}}, {{moment(ATA_Terminal_Inland).toISOString()}},
        {{Direct_Truck}}, {{Remarks}}, {{Containerverfuegbarkeit}}
    );
END
