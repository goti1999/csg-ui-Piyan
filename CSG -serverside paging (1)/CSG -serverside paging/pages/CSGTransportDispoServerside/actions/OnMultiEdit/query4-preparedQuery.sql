DECLARE @PayloadJSON NVARCHAR(MAX) = :param0;

-- Parse JSON into temp table
CREATE TABLE #TempPayload (
    CustomerID NVARCHAR(50),
    MBL_ID NVARCHAR(50),
    ContainerID NVARCHAR(50),
    Pincode NVARCHAR(50),
    DropOff_Terminal NVARCHAR(255)
    -- add other columns as needed
);

INSERT INTO #TempPayload
SELECT
    JSON_VALUE(value, '$.CustomerID') AS CustomerID,
    JSON_VALUE(value, '$.MBL_ID') AS MBL_ID,
    JSON_VALUE(value, '$.ContainerID') AS ContainerID,
    JSON_VALUE(value, '$.Pincode') AS Pincode,
    JSON_VALUE(value, '$.DropOff_Terminal') AS DropOff_Terminal
FROM OPENJSON(@PayloadJSON);

-- Update existing rows
UPDATE t
SET t.Pincode = p.Pincode,
    t.DropOff_Terminal = p.DropOff_Terminal
FROM dbo.Transport_Dispo_clone t
JOIN #TempPayload p
    ON t.CustomerID = p.CustomerID
   AND t.MBL_ID = p.MBL_ID
   AND t.ContainerID = p.ContainerID;

-- Insert missing rows
INSERT INTO dbo.Transport_Dispo_clone (CustomerID, MBL_ID, ContainerID, Pincode, DropOff_Terminal)
SELECT p.CustomerID, p.MBL_ID, p.ContainerID, p.Pincode, p.DropOff_Terminal
FROM #TempPayload p
LEFT JOIN dbo.Transport_Dispo_clone t
    ON t.CustomerID = p.CustomerID
   AND t.MBL_ID = p.MBL_ID
   AND t.ContainerID = p.ContainerID
WHERE t.CustomerID IS NULL;

DROP TABLE #TempPayload;
