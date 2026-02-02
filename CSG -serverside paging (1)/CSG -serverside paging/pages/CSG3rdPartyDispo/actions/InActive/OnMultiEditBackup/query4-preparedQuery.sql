DECLARE @SelectedRows TABLE (
    CustomerID NVARCHAR(50),
    MBL_ID NVARCHAR(50),
    ContainerID NVARCHAR(50)
);

-- Insert multiple selected rows
INSERT INTO @SelectedRows (CustomerID, MBL_ID, ContainerID)
SELECT 
    value.CustomerID,
    value.MBL_ID,
    value.ContainerID
FROM OPENJSON(?) 
WITH (
    CustomerID NVARCHAR(50),
    MBL_ID NVARCHAR(50),
    ContainerID NVARCHAR(50)
) AS value;
