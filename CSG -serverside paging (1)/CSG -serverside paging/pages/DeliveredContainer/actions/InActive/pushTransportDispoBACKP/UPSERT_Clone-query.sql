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
            Pincode = {{ ui.form13.value.Pincode ?? '' }},
            DropOff_Terminal = {{ ui.form13.value.DropOff_Terminal ?? '' }},
            DropOff_Terminal_TIR = {{ ui.form13.value.DropOff_Terminal_TIR ?? '' }},
            ETA_DeliveryAddress = {{ ui.form13.value.ETA_DeliveryAddress ? moment(ui.form13.value.ETA_DeliveryAddress).toISOString() : null }},
            Remarks = {{ ui.form13.value.Remarks ?? '' }},
            DeliveryAddress = {{ ui.form13.value.DeliveryAddress ?? '' }},
            ATA_Terminal_Inland = {{ ui.form13.value.ATA_Terminal_Inland ? moment(ui.form13.value.ATA_Terminal_Inland).toISOString() : null }},
            Containerverfuegbarkeit = {{ ui.form13.value.Containerverfuegbarkeit ? moment(ui.form13.value.Containerverfuegbarkeit).toISOString() : null }},
            Direct_Truck = {{ ui.form13.value.Direct_Truck ?? '' }},
            TransmissionTimestamp = {{ moment().utcOffset(0, true).toISOString() }},
            to_Transporter = {{ steps.code2.data.toTransporter }}
            
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
            {{ ui.form13.value.transport_Dispo_ID }},
            {{ ui.form13.value.Pincode ?? '' }},
            {{ ui.form13.value.DropOff_Terminal ?? '' }},
            {{ ui.form13.value.DropOff_Terminal_TIR ?? '' }},
            {{ ui.form13.value.ETA_DeliveryAddress ? moment(ui.form13.value.ETA_DeliveryAddress).toISOString() : null }},
            {{ ui.form13.value.Remarks ?? '' }},
            {{ ui.form13.value.DeliveryAddress ?? '' }},
            {{ ui.form13.value.ATA_Terminal_Inland ? moment(ui.form13.value.ATA_Terminal_Inland).toISOString() : null }},
            {{ ui.form13.value.Containerverfuegbarkeit ? moment(ui.form13.value.Containerverfuegbarkeit).toISOString() : null }},
            {{ ui.form13.value.Direct_Truck ?? '' }},
            {{ moment().utcOffset(0, true).toISOString() }},
            {{ ui.form13.value.CustomerID }},
            {{ ui.form13.value.MBL_ID }},
            {{ ui.form13.value.ContainerID }},
            {{ steps.code2.data.toTransporter }}
        );
    END
END
