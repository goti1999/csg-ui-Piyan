-- Loop through each row from the payload
{{#each steps.combinedArray.data as |row|}}
DECLARE @DispoID INT = {{row.transport_Dispo_ID}};

IF @DispoID IS NOT NULL
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM dbo.Transport_Dispo_clone
        WHERE CustomerID = {{row.CustomerID}} 
          AND MBL_ID = {{row.MBL_ID}} 
          AND ContainerID = {{row.ContainerID}}
    )
    BEGIN
        -- UPDATE existing row
        UPDATE dbo.Transport_Dispo_clone
        SET
            Pincode = {{row.Pincode}},
            DropOff_Terminal = {{row.DropOff_Terminal}},
            DropOff_Terminal_TIR = {{row.DropOff_Terminal_TIR}},
            ETA_DeliveryAddress = {{moment(row.ETA_DeliveryAddress).toISOString()}},
            DeliveryAddress = {{row.DeliveryAddress}},
            ATA_Terminal_Inland = {{moment(row.ATA_Terminal_Inland).toISOString()}},
            Direct_Truck = {{row.Direct_Truck}},
            Remarks = {{row.Remarks}},
            Containerverfuegbarkeit = {{row.Containerverfuegbarkeit}}
        WHERE CustomerID = {{row.CustomerID}} 
          AND MBL_ID = {{row.MBL_ID}} 
          AND ContainerID = {{row.ContainerID}};
    END
    ELSE
    BEGIN
        -- INSERT new row if it does not exist
        INSERT INTO dbo.Transport_Dispo_clone (
            Transport_Dispo_ID,
            Pincode,
            DropOff_Terminal,
            DropOff_Terminal_TIR,
            ETA_DeliveryAddress,
            DeliveryAddress,
            ATA_Terminal_Inland,
            Direct_Truck,
            Remarks,
            Containerverfuegbarkeit,
            CustomerID,
            MBL_ID,
            ContainerID
        )
        VALUES (
            {{row.transport_Dispo_ID}},
            {{row.Pincode}},
            {{row.DropOff_Terminal}},
            {{row.DropOff_Terminal_TIR}},
            {{moment(row.ETA_DeliveryAddress).toISOString()}},
            {{row.DeliveryAddress}},
            {{moment(row.ATA_Terminal_Inland).toISOString()}},
            {{row.Direct_Truck}},
            {{row.Remarks}},
            {{row.Containerverfuegbarkeit}},
            {{row.CustomerID}},
            {{row.MBL_ID}},
            {{row.ContainerID}}
        );
    END
END
{{/each}}
