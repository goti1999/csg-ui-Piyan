UPDATE dbo.Transport_Dispo_clone 
    SET
        ContainerSize = {{ ui.form.value.ContainerSize }},
        Carrier = {{ ui.form.value.Carrier }},
        Vessel = {{ ui.form.value.Vessel }},
        Pincode = {{ ui.form.value.Pincode }},
        DropOff_Terminal = {{ ui.form.value.DropOff_Terminal }},
        DropOff_Terminal_TIR = {{ ui.form.value.DropOff_Terminal_TIR }},
        ETA_DeliveryAddress = {{ moment(ui.form.value.ETA_DeliveryAddress).toISOString() }},
        Remarks = {{ ui.form.value.Remarks }},
        DeliveryAddress = {{ ui.form.value.DeliveryAddress }},
        ATA_Terminal_Inland = {{ moment(ui.form.value.ATA_Terminal_Inland).toISOString() }},
        Containerverfuegbarkeit = {{ ui.form.value.Containerverfuegbarkeit }},
        Transport_Mode_final_DeliveryAddress = {{ ui.form.value.Transport_Mode_final_DeliveryAddress }},
        Direct_Truck = {{ ui.form.value.Direct_Truck }}
   
   WHERE transport_Dispo_ID IN (
    {{ ui.MultiEditform.value.map(r => r.transport_Dispo_ID).join(',') }}
);

    