DECLARE @PageNumber INT = ? / ? + 1;
DECLARE @PageSize INT = ?;
DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

SELECT 
    d.*,
    tm.Wert AS MBL_No,
    tm2.Wert AS Container_No,
    (
        SELECT COUNT(*)
        FROM transport_messages msg
        WHERE msg.Transport_Dispo_ID = d.Transport_Dispo_ID
    ) AS error_count
FROM dbo.transport_UI AS d
JOIN dbo.Transport_Mapping tm
    ON tm.Schluessel = d.MBL_ID
    AND tm.Typ = 'M'
JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID
    AND tm2.Typ = 'C'
WHERE
    -- Delivered/cancellation logic
    (? IS NULL OR d.Delivered = ?)
    AND NOT (
        d.Status_Transport = 'transportAssignmentCancellation'
        AND d.Status_Dispo IS NULL
    )

    -- NVARCHAR / string filters with 'leer' support
    AND (
        (ISNULL(?, '') = 'leer' AND (d.Status_Dispo IS NULL OR LTRIM(RTRIM(d.Status_Dispo)) = ''))
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.Status_Dispo LIKE '%' + ? + '%'))
    )
    AND (
        (ISNULL(?, '') = 'leer' AND (d.Condition IS NULL OR LTRIM(RTRIM(d.Condition)) = ''))
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.Condition LIKE '%' + ? + '%'))
    )
    AND (
        (ISNULL(?, '') = 'leer' AND (d.Voyage IS NULL OR LTRIM(RTRIM(d.Voyage)) = ''))
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.Voyage LIKE '%' + ? + '%'))
    )
    AND (
        (ISNULL(?, '') = 'leer' AND (d.ContainerSize IS NULL OR LTRIM(RTRIM(d.ContainerSize)) = ''))
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.ContainerSize LIKE '%' + ? + '%'))
    )
    AND (
        (ISNULL(?, '') = 'leer' AND (d.CustomerID IS NULL OR LTRIM(RTRIM(d.CustomerID)) = ''))
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.CustomerID LIKE '%' + ? + '%'))
    )
    AND (
        (ISNULL(?, '') = 'leer' AND (d.MBL_ID IS NULL OR LTRIM(RTRIM(d.MBL_ID)) = ''))
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.MBL_ID LIKE '%' + ? + '%'))
    )
    AND (
        (ISNULL(?, '') = 'leer' AND (d.ContainerID IS NULL OR LTRIM(RTRIM(d.ContainerID)) = ''))
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.ContainerID LIKE '%' + ? + '%'))
    )
    -- repeat the same pattern for all other string columns (Status_Transport, Broker, Carrier, Vessel, etc.)

    -- BIT / boolean filters with 'leer' support
    AND (
        (ISNULL(?, '') = 'leer' AND d.AdvertFlag IS NULL)
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.AdvertFlag = ?))
    )
    AND (
        (ISNULL(?, '') = 'leer' AND d.RealAdvertFlag IS NULL)
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR d.RealAdvertFlag = ?))
    )
    -- repeat for all other BIT columns (Direct_Truck, todo, TAC, into_CW1, etc.)

    -- DATETIME filters with 'leer' support
    AND (
        (ISNULL(?, '') = 'leer' AND d.TransmissionTimestamp IS NULL)
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR FORMAT(d.TransmissionTimestamp,'dd-MM-yyyy') LIKE '%' + ? + '%'))
    )
    AND (
        (ISNULL(?, '') = 'leer' AND d.ATA_DeliveryAddress IS NULL)
        OR (ISNULL(?, '') <> 'leer' AND (ISNULL(?, '') = '' OR FORMAT(d.ATA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + ? + '%'))
    )
    -- repeat for all other datetime columns

ORDER BY d.TransmissionTimestamp
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
