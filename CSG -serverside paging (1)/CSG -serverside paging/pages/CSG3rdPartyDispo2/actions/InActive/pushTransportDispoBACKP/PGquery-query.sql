UPDATE dbo.Transport_Dispo_clone 
    SET
        ContainerSize = {{ ui.form4.value.ContainerSize }},
        Carrier = {{ ui.form4.value.Carrier }},
        Vessel = {{ ui.form4.value.Vessel }},
        Pincode = {{ ui.form4.value.Pincode }},
        DropOff_Terminal = {{ ui.form4.value.DropOff_Terminal }},
        DropOff_Terminal_TIR = {{ ui.form4.value.DropOff_Terminal_TIR }},
        ETA_DeliveryAddress = {{ moment(ui.form4.value.ETA_DeliveryAddress).toISOString() }},
        Remarks = {{ ui.form4.value.Remarks }},
        DeliveryAddress = {{ ui.form4.value.DeliveryAddress }},
        ATA_Terminal_Inland = {{ moment(ui.form4.value.ATA_Terminal_Inland).toISOString() }},
        Containerverfuegbarkeit = {{ ui.form4.value.Containerverfuegbarkeit }},
        Transport_Mode_final_DeliveryAddress = {{ ui.form4.value.Transport_Mode_final_DeliveryAddress }},
        Direct_Truck = {{ ui.form4.value.Direct_Truck }}
   
   WHERE transport_Dispo_ID IN (
    {{ ui.MultiEditform4.value.map(r => r.transport_Dispo_ID).join(',') }}
);

    