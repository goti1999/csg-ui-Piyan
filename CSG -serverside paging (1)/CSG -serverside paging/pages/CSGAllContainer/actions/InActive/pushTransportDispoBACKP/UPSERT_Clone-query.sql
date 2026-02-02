DECLARE @DispoID INT = {{ ui.form.value.transport_Dispo_ID }};

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone 
        WHERE CustomerID = {{ ui.form.value.CustomerID }} 
          AND MBL_ID = {{ ui.form.value.MBL_ID }} 
          AND ContainerID = {{ ui.form.value.ContainerID }}
    )
    BEGIN
        UPDATE dbo.Transport_Dispo_clone 
        SET
            Pincode = {{ ui.form.value.Pincode ?? '' }},
            DropOff_Terminal = {{ ui.form.value.DropOff_Terminal ?? '' }},
            DropOff_Terminal_TIR = {{ ui.form.value.DropOff_Terminal_TIR ?? '' }},
            ETA_DeliveryAddress = {{ ui.form.value.ETA_DeliveryAddress ? moment(ui.form.value.ETA_DeliveryAddress).toISOString() : null }},
            Remarks = {{ ui.form.value.Remarks ?? '' }},
            DeliveryAddress = {{ ui.form.value.DeliveryAddress ?? '' }},
            ATA_Terminal_Inland = {{ ui.form.value.ATA_Terminal_Inland ? moment(ui.form.value.ATA_Terminal_Inland).toISOString() : null }},
            Containerverfuegbarkeit = {{ ui.form.value.Containerverfuegbarkeit ? moment(ui.form.value.Containerverfuegbarkeit).toISOString() : null }},
            Direct_Truck = {{ ui.form.value.Direct_Truck ?? '' }},
            TransmissionTimestamp = {{ moment().utcOffset(0, true).toISOString() }},
            to_Transporter = {{ steps.code2.data.toTransporter }}
            
        WHERE CustomerID = {{ ui.form.value.CustomerID }} 
          AND MBL_ID = {{ ui.form.value.MBL_ID }} 
          AND ContainerID = {{ ui.form.value.ContainerID }};
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
            {{ ui.form.value.transport_Dispo_ID }},
            {{ ui.form.value.Pincode ?? '' }},
            {{ ui.form.value.DropOff_Terminal ?? '' }},
            {{ ui.form.value.DropOff_Terminal_TIR ?? '' }},
            {{ ui.form.value.ETA_DeliveryAddress ? moment(ui.form.value.ETA_DeliveryAddress).toISOString() : null }},
            {{ ui.form.value.Remarks ?? '' }},
            {{ ui.form.value.DeliveryAddress ?? '' }},
            {{ ui.form.value.ATA_Terminal_Inland ? moment(ui.form.value.ATA_Terminal_Inland).toISOString() : null }},
            {{ ui.form.value.Containerverfuegbarkeit ? moment(ui.form.value.Containerverfuegbarkeit).toISOString() : null }},
            {{ ui.form.value.Direct_Truck ?? '' }},
            {{ moment().utcOffset(0, true).toISOString() }},
            {{ ui.form.value.CustomerID }},
            {{ ui.form.value.MBL_ID }},
            {{ ui.form.value.ContainerID }},
            {{ steps.code2.data.toTransporter }}
        );
    END
END
