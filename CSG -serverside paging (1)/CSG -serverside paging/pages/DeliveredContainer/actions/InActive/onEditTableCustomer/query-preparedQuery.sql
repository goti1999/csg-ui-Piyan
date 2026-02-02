IF EXISTS (
    SELECT 1 
    FROM dbo.Transport_Dispo
    WHERE Transport_Dispo_ID = ?
)
BEGIN
    UPDATE dbo.Transport_Dispo
    SET
        to_Customer = ?,
        to_Transporter = ?
    WHERE Transport_Dispo_ID = ?;
END
ELSE
BEGIN
    INSERT INTO dbo.Transport_Dispo (
        Transport_Dispo_ID,
        to_Customer,
        to_Transporter
    )
    VALUES (
        ?,
        ?,
        ?
    );
END
