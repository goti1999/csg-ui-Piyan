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
        {{ ui.form11.value.transport_Dispo_ID }},
        {{ ui.form11.value.ContainerSize }},
        {{ ui.form11.value.Carrier }},
        {{ ui.form11.value.Vessel }},
        {{ ui.form11.value.Pincode }},
        {{ ui.form11.value.DropOff_Terminal }},
        {{ ui.form11.value.DropOff_Terminal_TIR }},
        {{ moment(ui.form11.value.ETA_DeliveryAddress).toISOString() }},
        {{ ui.form11.value.Remarks }},
        {{ ui.form11.value.DeliveryAddress }},
        {{ moment(ui.form11.value.ATA_Terminal_Inland).toISOString() }},
        {{ ui.form11.value.Containerverfuegbarkeit }},
        {{ ui.form11.value.Transport_Mode_final_DeliveryAddress }},
        {{ ui.form11.value.Direct_Truck }},
        {{ ui.form11.value.CustomerID }},
        {{ ui.form11.value.MBL_ID }},
        {{ ui.form11.value.ContainerID }}
    );

