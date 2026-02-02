DECLARE @DispoID INT = {{ ui.form3.value.transport_Dispo_ID }};

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone 
        WHERE CustomerID = {{ state.RowCustomerID}}
          AND MBL_ID = {{ state.RowMBL_ID }} 
          AND ContainerID = {{ state.RowContainerID }}
    )
    BEGIN
        UPDATE dbo.Transport_Dispo_clone 
        SET
            Pincode = {{ ui.form3.value.Pincode ?? '' }},
            DropOff_Terminal = {{ ui.form3.value.DropOff_Terminal ?? '' }},
            DropOff_Terminal_TIR = {{ ui.form3.value.DropOff_Terminal_TIR ?? '' }},
            ETA_DeliveryAddress = {{ ui.form3.value.ETA_DeliveryAddress ? moment(ui.form3.value.ETA_DeliveryAddress).toISOString() : null }},
            Remarks = {{ ui.form3.value.Remarks ?? '' }},
            DeliveryAddress = {{ ui.form3.value.DeliveryAddress ?? '' }},
            ATA_Terminal_Inland = {{ ui.form3.value.ATA_Terminal_Inland ? moment(ui.form3.value.ATA_Terminal_Inland).toISOString() : null }},
            Containerverfuegbarkeit = {{ ui.form3.value.Containerverfuegbarkeit ? moment(ui.form3.value.Containerverfuegbarkeit).toISOString() : null }},
            Direct_Truck = {{ ui.form3.value.Direct_Truck ?? '' }},
            TransmissionTimestamp = {{ moment().utcOffset(0, true).toISOString() }},
            to_Transporter = {{ steps.code2.data.toTransporter }}
            
        WHERE CustomerID = {{ ui.form3.value.CustomerID }} 
          AND MBL_ID = {{ ui.form3.value.MBL_ID }} 
          AND ContainerID = {{ ui.form3.value.ContainerID }};
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
            {{ ui.form3.value.transport_Dispo_ID }},
            {{ ui.form3.value.Pincode ?? '' }},
            {{ ui.form3.value.DropOff_Terminal ?? '' }},
            {{ ui.form3.value.DropOff_Terminal_TIR ?? '' }},
            {{ ui.form3.value.ETA_DeliveryAddress ? moment(ui.form3.value.ETA_DeliveryAddress).toISOString() : null }},
            {{ ui.form3.value.Remarks ?? '' }},
            {{ ui.form3.value.DeliveryAddress ?? '' }},
            {{ ui.form3.value.ATA_Terminal_Inland ? moment(ui.form3.value.ATA_Terminal_Inland).toISOString() : null }},
            {{ ui.form3.value.Containerverfuegbarkeit ? moment(ui.form3.value.Containerverfuegbarkeit).toISOString() : null }},
            {{ ui.form3.value.Direct_Truck ?? '' }},
            {{ moment().utcOffset(0, true).toISOString() }},
            {{ ui.form3.value.CustomerID }},
            {{ ui.form3.value.MBL_ID }},
            {{ ui.form3.value.ContainerID }},
            {{ steps.code2.data.toTransporter }}
        );
    END
END
