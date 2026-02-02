UPDATE dbo.transport_TA
SET
    
    to_Transporter = {{ steps.code2.data.toTransporter}}

    
WHERE
    CustomerID = {{ ui.ontable.selectedRow.data.CustomerID }} AND
    MBL_ID = {{ ui.ontable.selectedRow.data.MBL_ID }} AND
    ContainerID = {{ ui.ontable.selectedRow.data.ContainerID }};
