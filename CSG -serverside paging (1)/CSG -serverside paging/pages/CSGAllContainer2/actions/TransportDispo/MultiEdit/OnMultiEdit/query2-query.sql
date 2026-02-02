DECLARE @DispoID INT = {{ ui.form9.value.transport_Dispo_ID }};

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone 
        WHERE CustomerID = {{ ui.form9.value.CustomerID }} 
          AND MBL_ID = {{ ui.form9.value.MBL_ID }} 
          AND ContainerID = {{ ui.form9.value.ContainerID }}
    )
    BEGIN
        UPDATE dbo.Transport_Dispo_clone 
        SET
            Pincode = {{ ui.form9.value.Pincode }},
            DropOff_Terminal = {{ ui.form9.value.DropOff_Terminal }},
            DropOff_Terminal_TIR = {{ ui.form9.value.DropOff_Terminal_TIR }},
            ETA_DeliveryAddress = {{ moment(ui.form9.value.ETA_DeliveryAddress).toISOString() }},
            DeliveryAddress = {{ ui.form9.value.DeliveryAddress }},
            ATA_Terminal_Inland = {{ moment(ui.form9.value.ATA_Terminal_Inland).toISOString() }},
            Direct_Truck = {{ ui.form9.value.Direct_Truck }},
        
            
        WHERE CustomerID = {{ ui.form9.value.CustomerID }} 
          AND MBL_ID = {{ ui.form9.value.MBL_ID }} 
          AND ContainerID = {{ ui.form9.value.ContainerID }};
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
            {{ ui.form9.value.transport_Dispo_ID}},
            {{ ui.form9.value.Pincode }},
            {{ ui.form9.value.DropOff_Terminal }},
            {{ ui.form9.value.DropOff_Terminal_TIR }},
            {{ moment(ui.form9.value.ETA_DeliveryAddress).toISOString() }},
            {{ ui.form9.value.DeliveryAddress }},
            {{ moment(ui.form9.value.ATA_Terminal_Inland).toISOString() }},
            {{ ui.form9.value.Direct_Truck }},
            {{ ui.form9.value.CustomerID }},
            {{ ui.form9.value.MBL_ID }},
            {{ ui.form9.value.ContainerID }},
        );
    END
END
