UPDATE dbo.Transport_Dispo
SET
    
    to_Transporter = {{ steps.code2.data.toTransporter}}

    
WHERE
    CustomerID = {{ ui.ontable11.selectedRow.data.CustomerID }} AND
    MBL_ID = {{ ui.ontable11.selectedRow.data.MBL_ID }} AND
    ContainerID = {{ ui.ontable11.selectedRow.data.ContainerID }};
