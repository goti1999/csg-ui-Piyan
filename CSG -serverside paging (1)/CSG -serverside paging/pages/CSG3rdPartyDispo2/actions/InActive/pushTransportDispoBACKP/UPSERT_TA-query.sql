UPDATE dbo.transport_TA
SET
    
    to_Transporter = {{ steps.code2.data.toTransporter}}

    
WHERE
    CustomerID = {{ ui.ontable5.selectedRow.data.CustomerID }} AND
    MBL_ID = {{ ui.ontable5.selectedRow.data.MBL_ID }} AND
    ContainerID = {{ ui.ontable5.selectedRow.data.ContainerID }};
