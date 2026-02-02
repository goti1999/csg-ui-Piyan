UPDATE dbo.Transport_Dispo
SET
    
    to_Transporter = {{ steps.code2.data.toTransporter}}

    
WHERE
    CustomerID = {{ ui.ontable10.selectedRow.data.CustomerID }} AND
    MBL_ID = {{ ui.ontable10.selectedRow.data.MBL_ID }} AND
    ContainerID = {{ ui.ontable10.selectedRow.data.ContainerID }};
