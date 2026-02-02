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
        {{ ui.form9.value.transport_Dispo_ID }},
        {{ ui.form9.value.ContainerSize }},
        {{ ui.form9.value.Carrier }},
        {{ ui.form9.value.Vessel }},
        {{ ui.form9.value.Pincode }},
        {{ ui.form9.value.DropOff_Terminal }},
        {{ ui.form9.value.DropOff_Terminal_TIR }},
        {{ moment(ui.form9.value.ETA_DeliveryAddress).toISOString() }},
        {{ ui.form9.value.Remarks }},
        {{ ui.form9.value.DeliveryAddress }},
        {{ moment(ui.form9.value.ATA_Terminal_Inland).toISOString() }},
        {{ ui.form9.value.Containerverfuegbarkeit }},
        {{ ui.form9.value.Transport_Mode_final_DeliveryAddress }},
        {{ ui.form9.value.Direct_Truck }},
        {{ ui.form9.value.CustomerID }},
        {{ ui.form9.value.MBL_ID }},
        {{ ui.form9.value.ContainerID }}
    );

