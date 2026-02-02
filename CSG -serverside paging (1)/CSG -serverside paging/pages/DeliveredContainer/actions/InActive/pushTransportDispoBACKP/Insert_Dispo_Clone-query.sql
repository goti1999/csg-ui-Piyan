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
        {{ ui.form13.value.transport_Dispo_ID }},
        {{ ui.form13.value.ContainerSize }},
        {{ ui.form13.value.Carrier }},
        {{ ui.form13.value.Vessel }},
        {{ ui.form13.value.Pincode }},
        {{ ui.form13.value.DropOff_Terminal }},
        {{ ui.form13.value.DropOff_Terminal_TIR }},
        {{ moment(ui.form13.value.ETA_DeliveryAddress).toISOString() }},
        {{ ui.form13.value.Remarks }},
        {{ ui.form13.value.DeliveryAddress }},
        {{ moment(ui.form13.value.ATA_Terminal_Inland).toISOString() }},
        {{ ui.form13.value.Containerverfuegbarkeit }},
        {{ ui.form13.value.Transport_Mode_final_DeliveryAddress }},
        {{ ui.form13.value.Direct_Truck }},
        {{ ui.form13.value.CustomerID }},
        {{ ui.form13.value.MBL_ID }},
        {{ ui.form13.value.ContainerID }}
    );

