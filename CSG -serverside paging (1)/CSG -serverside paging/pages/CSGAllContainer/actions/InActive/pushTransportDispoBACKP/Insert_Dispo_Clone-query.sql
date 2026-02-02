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
        {{ ui.form.value.transport_Dispo_ID }},
        {{ ui.form.value.ContainerSize }},
        {{ ui.form.value.Carrier }},
        {{ ui.form.value.Vessel }},
        {{ ui.form.value.Pincode }},
        {{ ui.form.value.DropOff_Terminal }},
        {{ ui.form.value.DropOff_Terminal_TIR }},
        {{ moment(ui.form.value.ETA_DeliveryAddress).toISOString() }},
        {{ ui.form.value.Remarks }},
        {{ ui.form.value.DeliveryAddress }},
        {{ moment(ui.form.value.ATA_Terminal_Inland).toISOString() }},
        {{ ui.form.value.Containerverfuegbarkeit }},
        {{ ui.form.value.Transport_Mode_final_DeliveryAddress }},
        {{ ui.form.value.Direct_Truck }},
        {{ ui.form.value.CustomerID }},
        {{ ui.form.value.MBL_ID }},
        {{ ui.form.value.ContainerID }}
    );

