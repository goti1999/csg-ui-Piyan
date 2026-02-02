DECLARE @DispoID INT = {{ ui.form13.value.transport_Dispo_ID }};

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone 
        WHERE CustomerID = {{ ui.form13.value.CustomerID }} 
          AND MBL_ID = {{ ui.form13.value.MBL_ID }} 
          AND ContainerID = {{ ui.form13.value.ContainerID }}
    )
    BEGIN
        UPDATE dbo.Transport_Dispo_clone 
        SET
            Pincode = {{ ui.form13.value.Pincode }},
            DropOff_Terminal = {{ ui.form13.value.DropOff_Terminal }},
            DropOff_Terminal_TIR = {{ ui.form13.value.DropOff_Terminal_TIR }},
            ETA_DeliveryAddress = {{ moment(ui.form13.value.ETA_DeliveryAddress).toISOString() }},
            DeliveryAddress = {{ ui.form13.value.DeliveryAddress }},
            ATA_Terminal_Inland = {{ moment(ui.form13.value.ATA_Terminal_Inland).toISOString() }},
            Direct_Truck = {{ ui.form13.value.Direct_Truck }},
        
            
        WHERE CustomerID = {{ ui.form13.value.CustomerID }} 
          AND MBL_ID = {{ ui.form13.value.MBL_ID }} 
          AND ContainerID = {{ ui.form13.value.ContainerID }};
    END
    ELSE
    BEGIN
        INSERT INTO dbo.Transport_Dispo_clone (
            Transport_Dispo_ID,
            Pincode,
            DropOff_Terminal,
            DropOff_Terminal_TIR,
            ETA_DeliveryAddress,
            DeliveryAddress,
            ATA_Terminal_Inland,
            Direct_Truck,
            CustomerID,
            MBL_ID,
            ContainerID

        )
        VALUES (
            {{ ui.form13.value.transport_Dispo_ID}},
            {{ ui.form13.value.Pincode }},
            {{ ui.form13.value.DropOff_Terminal }},
            {{ ui.form13.value.DropOff_Terminal_TIR }},
            {{ moment(ui.form13.value.ETA_DeliveryAddress).toISOString() }},
            {{ ui.form13.value.DeliveryAddress }},
            {{ moment(ui.form13.value.ATA_Terminal_Inland).toISOString() }},
            {{ ui.form13.value.Direct_Truck }},
            {{ ui.form13.value.CustomerID }},
            {{ ui.form13.value.MBL_ID }},
            {{ ui.form13.value.ContainerID }},
        );
    END
END
