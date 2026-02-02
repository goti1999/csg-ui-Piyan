IF EXISTS (
    SELECT 1 
    FROM dbo.transport_dispo 
    WHERE Transport_Dispo_ID = ?
)
BEGIN
    UPDATE dbo.transport_dispo
    SET
        to_Customer = CASE 
            WHEN ? = 'true' THEN 1
            WHEN ? = 'false' THEN 0
            ELSE ? -- fallback if already 1 or 0
        END
    WHERE Transport_Dispo_ID = ?;
END
ELSE
BEGIN
    INSERT INTO dbo.transport_dispo (
        Transport_Dispo_ID,
        to_Customer
    )
    VALUES (
        ?,
        CASE 
            WHEN ? = 'true' THEN 1
            WHEN ? = 'false' THEN 0
            ELSE ?
        END
    );
END
