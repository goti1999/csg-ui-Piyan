INSERT INTO dbo.Transport_Dispo_clone (
        Transport_Dispo_ID,
        ContainerSize,
        Carrier,
        Vessel,
        Pincode,
        DropOff_Terminal,
        DropOff_Terminal_TIR,
        ETA_DeliveryAddress,
        Remarks,
        DeliveryAddress,
        ATA_Terminal_Inland,
        Containerverfuegbarkeit,
        Transport_Mode_final_DeliveryAddress,
        Direct_Truck,
        CustomerID,
        MBL_ID,
        ContainerID
    )
    VALUES (
        {{ ui.form10.value.transport_Dispo_ID }},
        {{ ui.form10.value.ContainerSize }},
        {{ ui.form10.value.Carrier }},
        {{ ui.form10.value.Vessel }},
        {{ ui.form10.value.Pincode }},
        {{ ui.form10.value.DropOff_Terminal }},
        {{ ui.form10.value.DropOff_Terminal_TIR }},
        {{ moment(ui.form10.value.ETA_DeliveryAddress).toISOString() }},
        {{ ui.form10.value.Remarks }},
        {{ ui.form10.value.DeliveryAddress }},
        {{ moment(ui.form10.value.ATA_Terminal_Inland).toISOString() }},
        {{ ui.form10.value.Containerverfuegbarkeit }},
        {{ ui.form10.value.Transport_Mode_final_DeliveryAddress }},
        {{ ui.form10.value.Direct_Truck }},
        {{ ui.form10.value.CustomerID }},
        {{ ui.form10.value.MBL_ID }},
        {{ ui.form10.value.ContainerID }}
    );

