DECLARE @DispoID INT = {{ ui.form8.value.transport_Dispo_ID }};

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone 
        WHERE CustomerID = {{ ui.form8.value.CustomerID }} 
          AND MBL_ID = {{ ui.form8.value.MBL_ID }} 
          AND ContainerID = {{ ui.form8.value.ContainerID }}
    )
    BEGIN
        UPDATE dbo.Transport_Dispo_clone 
        SET
            Pincode = {{ ui.form8.value.Pincode ? "'" + ui.form8.value.Pincode + "'" : "NULL" }},
            DropOff_Terminal = {{ ui.form8.value.DropOff_Terminal ? "'" + ui.form8.value.DropOff_Terminal + "'" : "NULL" }},
            DropOff_Terminal_TIR = {{ ui.form8.value.DropOff_Terminal_TIR ? "'" + ui.form8.value.DropOff_Terminal_TIR + "'" : "NULL" }},
            ETA_DeliveryAddress = {{ ui.form8.value.ETA_DeliveryAddress ? "'" + moment(ui.form8.value.ETA_DeliveryAddress).toISOString() + "'" : "NULL" }},
            Remarks = {{ ui.form8.value.Remarks ? "'" + ui.form8.value.Remarks + "'" : "NULL" }},
            DeliveryAddress = {{ ui.form8.value.DeliveryAddress ? "'" + ui.form8.value.DeliveryAddress + "'" : "NULL" }},
            ATA_Terminal_Inland = {{ ui.form8.value.ATA_Terminal_Inland ? "'" + moment(ui.form8.value.ATA_Terminal_Inland).toISOString() + "'" : "NULL" }},
            Containerverfuegbarkeit = {{ ui.form8.value.Containerverfuegbarkeit ? "'" + moment(ui.form8.value.Containerverfuegbarkeit).toISOString() + "'" : "NULL" }},
            Direct_Truck = {{ ui.form8.value.Direct_Truck ? "'" + ui.form8.value.Direct_Truck + "'" : "NULL" }},
            TransmissionTimestamp = '{{ moment().utcOffset(0, true).toISOString() }}',
            to_Transporter = {{ steps.code2.data.toTransporter ? "'" + steps.code2.data.toTransporter + "'" : "NULL" }}
            
        WHERE CustomerID = {{ ui.form8.value.CustomerID }} 
          AND MBL_ID = {{ ui.form8.value.MBL_ID }} 
          AND ContainerID = {{ ui.form8.value.ContainerID }};
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
            {{ ui.form8.value.transport_Dispo_ID }},
            {{ ui.form8.value.Pincode ? "'" + ui.form8.value.Pincode + "'" : "NULL" }},
            {{ ui.form8.value.DropOff_Terminal ? "'" + ui.form8.value.DropOff_Terminal + "'" : "NULL" }},
            {{ ui.form8.value.DropOff_Terminal_TIR ? "'" + ui.form8.value.DropOff_Terminal_TIR + "'" : "NULL" }},
            {{ ui.form8.value.ETA_DeliveryAddress ? "'" + moment(ui.form8.value.ETA_DeliveryAddress).toISOString() + "'" : "NULL" }},
            {{ ui.form8.value.Remarks ? "'" + ui.form8.value.Remarks + "'" : "NULL" }},
            {{ ui.form8.value.DeliveryAddress ? "'" + ui.form8.value.DeliveryAddress + "'" : "NULL" }},
            {{ ui.form8.value.ATA_Terminal_Inland ? "'" + moment(ui.form8.value.ATA_Terminal_Inland).toISOString() + "'" : "NULL" }},
            {{ ui.form8.value.Containerverfuegbarkeit ? "'" + moment(ui.form8.value.Containerverfuegbarkeit).toISOString() + "'" : "NULL" }},
            {{ ui.form8.value.Direct_Truck ? "'" + ui.form8.value.Direct_Truck + "'" : "NULL" }},
            '{{ moment().utcOffset(0, true).toISOString() }}',
            {{ ui.form8.value.CustomerID }},
            {{ ui.form8.value.MBL_ID }},
            {{ ui.form8.value.ContainerID }},
            {{ steps.code2.data.toTransporter ? "'" + steps.code2.data.toTransporter + "'" : "NULL" }}
        );
    END
END
