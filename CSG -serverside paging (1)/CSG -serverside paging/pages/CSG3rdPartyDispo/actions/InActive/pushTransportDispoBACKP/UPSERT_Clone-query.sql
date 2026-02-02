DECLARE @DispoID INT = {{ ui.form11.value.transport_Dispo_ID }};

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone 
        WHERE CustomerID = {{ ui.form11.value.CustomerID }} 
          AND MBL_ID = {{ ui.form11.value.MBL_ID }} 
          AND ContainerID = {{ ui.form11.value.ContainerID }}
    )
    BEGIN
        UPDATE dbo.Transport_Dispo_clone 
        SET
            Pincode = {{ ui.form11.value.Pincode ?? '' }},
            DropOff_Terminal = {{ ui.form11.value.DropOff_Terminal ?? '' }},
            DropOff_Terminal_TIR = {{ ui.form11.value.DropOff_Terminal_TIR ?? '' }},
            ETA_DeliveryAddress = {{ ui.form11.value.ETA_DeliveryAddress ? moment(ui.form11.value.ETA_DeliveryAddress).toISOString() : null }},
            Remarks = {{ ui.form11.value.Remarks ?? '' }},
            DeliveryAddress = {{ ui.form11.value.DeliveryAddress ?? '' }},
            ATA_Terminal_Inland = {{ ui.form11.value.ATA_Terminal_Inland ? moment(ui.form11.value.ATA_Terminal_Inland).toISOString() : null }},
            Containerverfuegbarkeit = {{ ui.form11.value.Containerverfuegbarkeit ? moment(ui.form11.value.Containerverfuegbarkeit).toISOString() : null }},
            Direct_Truck = {{ ui.form11.value.Direct_Truck ?? '' }},
            TransmissionTimestamp = {{ moment().utcOffset(0, true).toISOString() }},
            to_Transporter = {{ steps.code2.data.toTransporter }}
            
        WHERE CustomerID = {{ ui.form11.value.CustomerID }} 
          AND MBL_ID = {{ ui.form11.value.MBL_ID }} 
          AND ContainerID = {{ ui.form11.value.ContainerID }};
    END
    ELSE
    BEGIN
        INSERT INTO dbo.Transport_Dispo_clone (
            Transport_Dispo_ID,
            Pincode,
            DropOff_Terminal,
            DropOff_Terminal_TIR,
            ETA_DeliveryAddress,
            Remarks,
            DeliveryAddress,
            ATA_Terminal_Inland,
            Containerverfuegbarkeit,
            Direct_Truck,
            TransmissionTimestamp,
            CustomerID,
            MBL_ID,
            ContainerID,
            to_Transporter
        )
        VALUES (
            {{ ui.form11.value.transport_Dispo_ID }},
            {{ ui.form11.value.Pincode ?? '' }},
            {{ ui.form11.value.DropOff_Terminal ?? '' }},
            {{ ui.form11.value.DropOff_Terminal_TIR ?? '' }},
            {{ ui.form11.value.ETA_DeliveryAddress ? moment(ui.form11.value.ETA_DeliveryAddress).toISOString() : null }},
            {{ ui.form11.value.Remarks ?? '' }},
            {{ ui.form11.value.DeliveryAddress ?? '' }},
            {{ ui.form11.value.ATA_Terminal_Inland ? moment(ui.form11.value.ATA_Terminal_Inland).toISOString() : null }},
            {{ ui.form11.value.Containerverfuegbarkeit ? moment(ui.form11.value.Containerverfuegbarkeit).toISOString() : null }},
            {{ ui.form11.value.Direct_Truck ?? '' }},
            {{ moment().utcOffset(0, true).toISOString() }},
            {{ ui.form11.value.CustomerID }},
            {{ ui.form11.value.MBL_ID }},
            {{ ui.form11.value.ContainerID }},
            {{ steps.code2.data.toTransporter }}
        );
    END
END
