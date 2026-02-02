UPDATE dbo.Transport_Dispo
SET
    
    to_Transporter = ?

    
WHERE
    CustomerID = ? AND
    MBL_ID = ? AND
    ContainerID = ?;
