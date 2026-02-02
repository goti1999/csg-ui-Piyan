UPDATE dbo.Transport_Dispo_clone 
    SET
        ContainerSize = {{ ui.form13.value.ContainerSize }},
        Carrier = {{ ui.form13.value.Carrier }},
        Vessel = {{ ui.form13.value.Vessel }},
        Pincode = {{ ui.form13.value.Pincode }},
        DropOff_Terminal = {{ ui.form13.value.DropOff_Terminal }},
        DropOff_Terminal_TIR = {{ ui.form13.value.DropOff_Terminal_TIR }},
        ETA_DeliveryAddress = {{ moment(ui.form13.value.ETA_DeliveryAddress).toISOString() }},
        Remarks = {{ ui.form13.value.Remarks }},
        DeliveryAddress = {{ ui.form13.value.DeliveryAddress }},
        ATA_Terminal_Inland = {{ moment(ui.form13.value.ATA_Terminal_Inland).toISOString() }},
        Containerverfuegbarkeit = {{ ui.form13.value.Containerverfuegbarkeit }},
        Transport_Mode_final_DeliveryAddress = {{ ui.form13.value.Transport_Mode_final_DeliveryAddress }},
        Direct_Truck = {{ ui.form13.value.Direct_Truck }}
   
   WHERE transport_Dispo_ID IN (
    {{ ui.MultiEditform12.value.map(r => r.transport_Dispo_ID).join(',') }}
);

    