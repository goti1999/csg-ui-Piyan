UPDATE dbo.Transport_Dispo_clone 
    SET
        ContainerSize = ?,
        Carrier = ?,
        Vessel = ?,
        Pincode = ?,
        DropOff_Terminal = ?,
        DropOff_Terminal_TIR = ?,
        ETA_DeliveryAddress = ?,
        Remarks = ?,
        DeliveryAddress = ?,
        ATA_Terminal_Inland = ?,
        Containerverfuegbarkeit = ?,
        Transport_Mode_final_DeliveryAddress = ?,
        Direct_Truck = ?
   
   WHERE transport_Dispo_ID IN (
    ?
);

    