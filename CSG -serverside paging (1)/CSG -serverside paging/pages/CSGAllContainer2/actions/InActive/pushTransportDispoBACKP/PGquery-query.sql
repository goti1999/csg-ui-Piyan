UPDATE dbo.Transport_Dispo_clone 
    SET
        ContainerSize = {{ ui.form9.value.ContainerSize }},
        Carrier = {{ ui.form9.value.Carrier }},
        Vessel = {{ ui.form9.value.Vessel }},
        Pincode = {{ ui.form9.value.Pincode }},
        DropOff_Terminal = {{ ui.form9.value.DropOff_Terminal }},
        DropOff_Terminal_TIR = {{ ui.form9.value.DropOff_Terminal_TIR }},
        ETA_DeliveryAddress = {{ moment(ui.form9.value.ETA_DeliveryAddress).toISOString() }},
        Remarks = {{ ui.form9.value.Remarks }},
        DeliveryAddress = {{ ui.form9.value.DeliveryAddress }},
        ATA_Terminal_Inland = {{ moment(ui.form9.value.ATA_Terminal_Inland).toISOString() }},
        Containerverfuegbarkeit = {{ ui.form9.value.Containerverfuegbarkeit }},
        Transport_Mode_final_DeliveryAddress = {{ ui.form9.value.Transport_Mode_final_DeliveryAddress }},
        Direct_Truck = {{ ui.form9.value.Direct_Truck }}
   
   WHERE transport_Dispo_ID IN (
    {{ ui.MultiEditform8.value.map(r => r.transport_Dispo_ID).join(',') }}
);

    