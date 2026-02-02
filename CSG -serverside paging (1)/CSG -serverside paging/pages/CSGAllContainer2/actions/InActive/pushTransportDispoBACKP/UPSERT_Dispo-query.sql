UPDATE dbo.Transport_Dispo
SET
    
    to_Transporter = {{ steps.code2.data.toTransporter}}

    
WHERE
    CustomerID = {{ ui.ontable9.selectedRow.data.CustomerID }} AND
    MBL_ID = {{ ui.ontable9.selectedRow.data.MBL_ID }} AND
    ContainerID = {{ ui.ontable9.selectedRow.data.ContainerID }};
