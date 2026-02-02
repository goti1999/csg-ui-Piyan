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
            Pincode = {{ ui.form.value.Pincode ? "'" + ui.form.value.Pincode + "'" : "NULL" }},
            DropOff_Terminal = {{ ui.form.value.DropOff_Terminal ? "'" + ui.form.value.DropOff_Terminal + "'" : "NULL" }},
            DropOff_Terminal_TIR = {{ ui.form.value.DropOff_Terminal_TIR ? "'" + ui.form.value.DropOff_Terminal_TIR + "'" : "NULL" }},
            ETA_DeliveryAddress = {{ ui.form.value.ETA_DeliveryAddress ? "'" + moment(ui.form.value.ETA_DeliveryAddress).toISOString() + "'" : "NULL" }},
            Remarks = {{ ui.form.value.Remarks ? "'" + ui.form.value.Remarks + "'" : "NULL" }},
            DeliveryAddress = {{ ui.form.value.DeliveryAddress ? "'" + ui.form.value.DeliveryAddress + "'" : "NULL" }},
            ATA_Terminal_Inland = {{ ui.form.value.ATA_Terminal_Inland ? "'" + moment(ui.form.value.ATA_Terminal_Inland).toISOString() + "'" : "NULL" }},
            ATA_DropOff_Terminal = {{ ui.form.value.ATA_DropOff_Terminal ? "'" + moment(ui.form.value.ATA_DropOff_Terminal).toISOString() + "'" : "NULL" }},
            Containerverfuegbarkeit = {{ ui.form.value.Containerverfuegbarkeit ? "'" + moment(ui.form.value.Containerverfuegbarkeit).toISOString() + "'" : "NULL" }},
            Direct_Truck = {{ ui.form.value.Direct_Truck ? "'" + ui.form.value.Direct_Truck + "'" : "NULL" }},
            TransmissionTimestamp = '{{ moment().utcOffset(0, true).toISOString() }}',
            to_Transporter = {{ steps.code2.data.toTransporter ? "'" + steps.code2.data.toTransporter + "'" : "NULL" }}
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
            ATA_DropOff_Terminal,
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
            {{ ui.form.value.Pincode ? "'" + ui.form.value.Pincode + "'" : "NULL" }},
            {{ ui.form.value.DropOff_Terminal ? "'" + ui.form.value.DropOff_Terminal + "'" : "NULL" }},
            {{ ui.form.value.DropOff_Terminal_TIR ? "'" + ui.form.value.DropOff_Terminal_TIR + "'" : "NULL" }},
            {{ ui.form.value.ETA_DeliveryAddress ? "'" + moment(ui.form.value.ETA_DeliveryAddress).toISOString() + "'" : "NULL" }},
            {{ ui.form.value.Remarks ? "'" + ui.form.value.Remarks + "'" : "NULL" }},
            {{ ui.form.value.DeliveryAddress ? "'" + ui.form.value.DeliveryAddress + "'" : "NULL" }},
            {{ ui.form.value.ATA_Terminal_Inland ? "'" + moment(ui.form.value.ATA_Terminal_Inland).toISOString() + "'" : "NULL" }},
            {{ ui.form.value.ATA_DropOff_Terminal ? "'" + moment(ui.form.value.ATA_DropOff_Terminal).toISOString() + "'" : "NULL" }},
            {{ ui.form.value.Containerverfuegbarkeit ? "'" + moment(ui.form.value.Containerverfuegbarkeit).toISOString() + "'" : "NULL" }},
            {{ ui.form.value.Direct_Truck ? "'" + ui.form.value.Direct_Truck + "'" : "NULL" }},
            '{{ moment().utcOffset(0, true).toISOString() }}',
            {{ ui.form.value.CustomerID }},
            {{ ui.form.value.MBL_ID }},
            {{ ui.form.value.ContainerID }},
            {{ steps.code2.data.toTransporter ? "'" + steps.code2.data.toTransporter + "'" : "NULL" }}
        );
    END
END
