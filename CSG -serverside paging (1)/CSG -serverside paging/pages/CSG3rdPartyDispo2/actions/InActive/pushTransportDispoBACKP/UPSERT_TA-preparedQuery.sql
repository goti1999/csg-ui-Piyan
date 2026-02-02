UPDATE dbo.transport_TA
SET
    
    to_Transporter = ?

    
WHERE
    CustomerID = ? AND
    MBL_ID = ? AND
    ContainerID = ?;
