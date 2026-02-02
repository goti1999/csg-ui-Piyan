UPDATE dbo.transport_TA
SET
    
    to_Transporter = {{ steps.code2.data.toTransporter}}

    
WHERE
    CustomerID = {{ ui.ontable13.selectedRow.data.CustomerID }} AND
    MBL_ID = {{ ui.ontable13.selectedRow.data.MBL_ID }} AND
    ContainerID = {{ ui.ontable13.selectedRow.data.ContainerID }};
