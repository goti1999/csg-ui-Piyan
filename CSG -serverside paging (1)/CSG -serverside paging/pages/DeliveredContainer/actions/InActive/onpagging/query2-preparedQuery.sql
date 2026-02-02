-- Total count query with same filters as main query
-- This should be a separate action in UI Bakery

-- Declare filter variables with proper null handling
DECLARE @CustomerID NVARCHAR(255) = ?;
DECLARE @MBL_ID NVARCHAR(255) = '?';
DECLARE @ContainerID NVARCHAR(255) = '?';
DECLARE @Status NVARCHAR(255) = '?';
DECLARE @TransmissionTimestamp NVARCHAR(255) = '?';
DECLARE @Voyage NVARCHAR(255) = '?';
DECLARE @ContainerSize NVARCHAR(255) = '?';
DECLARE @Broker NVARCHAR(255) = '?';
DECLARE @Carrier NVARCHAR(255) = '?';
DECLARE @Vessel NVARCHAR(255) = '?';
-- Add all other filter variables as needed...

SELECT COUNT(*) AS total_count
FROM dbo.transport_UI as d
JOIN dbo.Transport_Mapping tm
    ON tm.Schluessel = d.MBL_ID AND tm.Typ = 'M'
JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID AND tm2.Typ = 'C'
WHERE
    (@CustomerID = '' OR d.CustomerID LIKE CONCAT('%', @CustomerID, '%'))
    AND (@MBL_ID = '' OR d.MBL_ID LIKE CONCAT('%', @MBL_ID, '%'))
    AND (@ContainerID = '' OR d.ContainerID LIKE CONCAT('%', @ContainerID, '%'))
    AND (@Status = '' OR d.Status LIKE CONCAT('%', @Status, '%'))
    AND (@TransmissionTimestamp = '' OR d.TransmissionTimestamp LIKE CONCAT('%', @TransmissionTimestamp, '%'))
    AND (@Voyage = '' OR d.Voyage LIKE CONCAT('%', @Voyage, '%'))
    AND (@ContainerSize = '' OR d.ContainerSize LIKE CONCAT('%', @ContainerSize, '%'))
    AND (@Broker = '' OR d.Broker LIKE CONCAT('%', @Broker, '%'))
    AND (@Carrier = '' OR d.Carrier LIKE CONCAT('%', @Carrier, '%'))
    AND (@Vessel = '' OR d.Vessel LIKE CONCAT('%', @Vessel, '%'))
    -- Add all other filter conditions as needed...
    ;