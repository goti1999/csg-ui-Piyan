UPDATE dbo.Transport_Dispo_clone 
    SET
        ContainerSize = {{ ui.form11.value.ContainerSize }},
        Carrier = {{ ui.form11.value.Carrier }},
        Vessel = {{ ui.form11.value.Vessel }},
        Pincode = {{ ui.form11.value.Pincode }},
        DropOff_Terminal = {{ ui.form11.value.DropOff_Terminal }},
        DropOff_Terminal_TIR = {{ ui.form11.value.DropOff_Terminal_TIR }},
        ETA_DeliveryAddress = {{ moment(ui.form11.value.ETA_DeliveryAddress).toISOString() }},
        Remarks = {{ ui.form11.value.Remarks }},
        DeliveryAddress = {{ ui.form11.value.DeliveryAddress }},
        ATA_Terminal_Inland = {{ moment(ui.form11.value.ATA_Terminal_Inland).toISOString() }},
        Containerverfuegbarkeit = {{ ui.form11.value.Containerverfuegbarkeit }},
        Transport_Mode_final_DeliveryAddress = {{ ui.form11.value.Transport_Mode_final_DeliveryAddress }},
        Direct_Truck = {{ ui.form11.value.Direct_Truck }}
   
   WHERE transport_Dispo_ID IN (
    {{ ui.MultiEditform10.value.map(r => r.transport_Dispo_ID).join(',') }}
);

    