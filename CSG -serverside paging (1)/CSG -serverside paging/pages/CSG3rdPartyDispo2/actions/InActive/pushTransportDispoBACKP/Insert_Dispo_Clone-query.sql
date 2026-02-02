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
        {{ ui.form4.value.transport_Dispo_ID }},
        {{ ui.form4.value.ContainerSize }},
        {{ ui.form4.value.Carrier }},
        {{ ui.form4.value.Vessel }},
        {{ ui.form4.value.Pincode }},
        {{ ui.form4.value.DropOff_Terminal }},
        {{ ui.form4.value.DropOff_Terminal_TIR }},
        {{ moment(ui.form4.value.ETA_DeliveryAddress).toISOString() }},
        {{ ui.form4.value.Remarks }},
        {{ ui.form4.value.DeliveryAddress }},
        {{ moment(ui.form4.value.ATA_Terminal_Inland).toISOString() }},
        {{ ui.form4.value.Containerverfuegbarkeit }},
        {{ ui.form4.value.Transport_Mode_final_DeliveryAddress }},
        {{ ui.form4.value.Direct_Truck }},
        {{ ui.form4.value.CustomerID }},
        {{ ui.form4.value.MBL_ID }},
        {{ ui.form4.value.ContainerID }}
    );

