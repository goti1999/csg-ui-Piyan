UPDATE dbo.Transport_Dispo_clone 
    SET
        ContainerSize = {{ ui.form10.value.ContainerSize }},
        Carrier = {{ ui.form10.value.Carrier }},
        Vessel = {{ ui.form10.value.Vessel }},
        Pincode = {{ ui.form10.value.Pincode }},
        DropOff_Terminal = {{ ui.form10.value.DropOff_Terminal }},
        DropOff_Terminal_TIR = {{ ui.form10.value.DropOff_Terminal_TIR }},
        ETA_DeliveryAddress = {{ moment(ui.form10.value.ETA_DeliveryAddress).toISOString() }},
        Remarks = {{ ui.form10.value.Remarks }},
        DeliveryAddress = {{ ui.form10.value.DeliveryAddress }},
        ATA_Terminal_Inland = {{ moment(ui.form10.value.ATA_Terminal_Inland).toISOString() }},
        Containerverfuegbarkeit = {{ ui.form10.value.Containerverfuegbarkeit }},
        Transport_Mode_final_DeliveryAddress = {{ ui.form10.value.Transport_Mode_final_DeliveryAddress }},
        Direct_Truck = {{ ui.form10.value.Direct_Truck }}
   
   WHERE transport_Dispo_ID IN (
    {{ ui.MultiEditform9.value.map(r => r.transport_Dispo_ID).join(',') }}
);

    