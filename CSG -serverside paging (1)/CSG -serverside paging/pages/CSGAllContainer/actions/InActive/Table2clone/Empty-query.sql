DECLARE @PageNumber INT = {{ui.ontable.paginationOffset}} / {{ui.ontable.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable.pageSize}};
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
    ({{ ui.ontable.filters.Delivered }} IS NULL OR d.Delivered = {{ ui.ontable.filters.Delivered }})
    AND NOT (
        d.Status_Transport = 'transportAssignmentCancellation'
        AND d.Status_Dispo IS NULL
    )

    -- NVARCHAR / string filters with 'leer' support
    AND (
        (ISNULL({{ ui.ontable.filters.Status_Dispo }}, '') = 'leer' AND (d.Status_Dispo IS NULL OR LTRIM(RTRIM(d.Status_Dispo)) = ''))
        OR (ISNULL({{ ui.ontable.filters.Status_Dispo }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.Status_Dispo }}, '') = '' OR d.Status_Dispo LIKE '%' + {{ ui.ontable.filters.Status_Dispo }} + '%'))
    )
    AND (
        (ISNULL({{ ui.ontable.filters.Condition }}, '') = 'leer' AND (d.Condition IS NULL OR LTRIM(RTRIM(d.Condition)) = ''))
        OR (ISNULL({{ ui.ontable.filters.Condition }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.Condition }}, '') = '' OR d.Condition LIKE '%' + {{ ui.ontable.filters.Condition }} + '%'))
    )
    AND (
        (ISNULL({{ ui.ontable.filters.Voyage }}, '') = 'leer' AND (d.Voyage IS NULL OR LTRIM(RTRIM(d.Voyage)) = ''))
        OR (ISNULL({{ ui.ontable.filters.Voyage }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.Voyage }}, '') = '' OR d.Voyage LIKE '%' + {{ ui.ontable.filters.Voyage }} + '%'))
    )
    AND (
        (ISNULL({{ ui.ontable.filters.ContainerSize }}, '') = 'leer' AND (d.ContainerSize IS NULL OR LTRIM(RTRIM(d.ContainerSize)) = ''))
        OR (ISNULL({{ ui.ontable.filters.ContainerSize }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.ContainerSize }}, '') = '' OR d.ContainerSize LIKE '%' + {{ ui.ontable.filters.ContainerSize }} + '%'))
    )
    AND (
        (ISNULL({{ ui.ontable.filters.CustomerID }}, '') = 'leer' AND (d.CustomerID IS NULL OR LTRIM(RTRIM(d.CustomerID)) = ''))
        OR (ISNULL({{ ui.ontable.filters.CustomerID }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.CustomerID }}, '') = '' OR d.CustomerID LIKE '%' + {{ ui.ontable.filters.CustomerID }} + '%'))
    )
    AND (
        (ISNULL({{ ui.ontable.filters.MBL_ID }}, '') = 'leer' AND (d.MBL_ID IS NULL OR LTRIM(RTRIM(d.MBL_ID)) = ''))
        OR (ISNULL({{ ui.ontable.filters.MBL_ID }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.MBL_ID }}, '') = '' OR d.MBL_ID LIKE '%' + {{ ui.ontable.filters.MBL_ID }} + '%'))
    )
    AND (
        (ISNULL({{ ui.ontable.filters.ContainerID }}, '') = 'leer' AND (d.ContainerID IS NULL OR LTRIM(RTRIM(d.ContainerID)) = ''))
        OR (ISNULL({{ ui.ontable.filters.ContainerID }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.ContainerID }}, '') = '' OR d.ContainerID LIKE '%' + {{ ui.ontable.filters.ContainerID }} + '%'))
    )
    -- repeat the same pattern for all other string columns (Status_Transport, Broker, Carrier, Vessel, etc.)

    -- BIT / boolean filters with 'leer' support
    AND (
        (ISNULL({{ ui.ontable.filters.AdvertFlag }}, '') = 'leer' AND d.AdvertFlag IS NULL)
        OR (ISNULL({{ ui.ontable.filters.AdvertFlag }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.AdvertFlag }}, '') = '' OR d.AdvertFlag = {{ ui.ontable.filters.AdvertFlag }}))
    )
    AND (
        (ISNULL({{ ui.ontable.filters.RealAdvertFlag }}, '') = 'leer' AND d.RealAdvertFlag IS NULL)
        OR (ISNULL({{ ui.ontable.filters.RealAdvertFlag }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.RealAdvertFlag }}, '') = '' OR d.RealAdvertFlag = {{ ui.ontable.filters.RealAdvertFlag }}))
    )
    -- repeat for all other BIT columns (Direct_Truck, todo, TAC, into_CW1, etc.)

    -- DATETIME filters with 'leer' support
    AND (
        (ISNULL({{ ui.ontable.filters.TransmissionTimestamp }}, '') = 'leer' AND d.TransmissionTimestamp IS NULL)
        OR (ISNULL({{ ui.ontable.filters.TransmissionTimestamp }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.TransmissionTimestamp }}, '') = '' OR FORMAT(d.TransmissionTimestamp,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.TransmissionTimestamp }} + '%'))
    )
    AND (
        (ISNULL({{ ui.ontable.filters.ATA_DeliveryAddress }}, '') = 'leer' AND d.ATA_DeliveryAddress IS NULL)
        OR (ISNULL({{ ui.ontable.filters.ATA_DeliveryAddress }}, '') <> 'leer' AND (ISNULL({{ ui.ontable.filters.ATA_DeliveryAddress }}, '') = '' OR FORMAT(d.ATA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ATA_DeliveryAddress }} + '%'))
    )
    -- repeat for all other datetime columns

ORDER BY d.TransmissionTimestamp
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
