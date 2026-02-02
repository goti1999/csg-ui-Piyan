-- Pagination Variables
DECLARE @PageNumber INT = {{ui.ontable9.paginationOffset}} / {{ui.ontable9.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable9.pageSize}};
DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

-- Sorting Variables
DECLARE @SortColumn NVARCHAR(100) = '{{ ui.ontable9.sortColumn ?? "MBL_No" }}';
DECLARE @SortDirection NVARCHAR(4) = '{{ ui.ontable9.sortDirection ?? "ASC" }}';

-- Filter Variables
DECLARE @Status NVARCHAR(255) = '%{{ ui.ontable9.filters.Status ?? "" }}%';
DECLARE @TransmissionTimestamp NVARCHAR(255) = '%{{ ui.ontable9.filters.TransmissionTimestamp ?? "" }}%';
DECLARE @Voyage NVARCHAR(255) = '%{{ ui.ontable9.filters.Voyage ?? "" }}%';
DECLARE @ContainerSize NVARCHAR(255) = '%{{ ui.ontable9.filters.ContainerSize ?? "" }}%';
DECLARE @Broker NVARCHAR(255) = '%{{ ui.ontable9.filters.Broker ?? "" }}%';
DECLA @Carrier NVARCHAR(255) = '%{{ ui.ontable9.filters.Carrier ?? "" }}%';
DECLARE @Vessel NVARCHAR(255) = '%{{ ui.ontable9.filters.Vessel ?? "" }}%';
DECLARE @PortOfDischarge_Lima NVARCHAR(255) = '%{{ ui.ontable9.filters.PortOfDischarge_Lima ?? "" }}%';
DECLARE @ETA_PortOfDischarge NVARCHAR(255) = '%{{ ui.ontable9.filters.ETA_PortOfDischarge ?? "" }}%';
DECLARE @PackingMethod NVARCHAR(255) = '%{{ ui.ontable9.filters.PackingMethod ?? "" }}%';
DECLARE @TotalWeight NVARCHAR(255) = '%{{ ui.ontable9.filters.TotalWeight ?? "" }}%';
DECLARE @AdvertFlag NVARCHAR(255) = '%{{ ui.ontable9.filters.AdvertFlag ?? "" }}%';
DECLARE @RealAdvertFlag NVARCHAR(255) = '%{{ ui.ontable9.filters.RealAdvertFlag ?? "" }}%';
DECLARE @ETA_Delivery_Address_Update_TimeStamp NVARCHAR(255) = '%{{ ui.ontable9.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }}%';

-- Main Query
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
    ON tm.Schluessel = d.MBL_ID AND tm.Typ = 'M'
JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID AND tm2.Typ = 'C'
WHERE
    (d.Status LIKE @Status OR @Status = '%')
    AND (d.TransmissionTimestamp LIKE @ transmissionTimestamp OR @TransmissionTimestamp = '%')
    AND (d.Voyage LIKE @Voyage OR @Voyage = '%')
    AND (d.ContainerSize LIKE @ContainerSize OR @ContainerSize = '%')
    AND (d.Broker LIKE @Broker OR @Broker = '%')
    AND (d.Carrier LIKE @Carrier OR @Carrier = '%')
    AND (d.Vessel LIKE @Vessel OR @Vessel = '%')
    AND (d.PortOfDischarge_Lima LIKE @PortOfDischarge_Lima OR @PortOfDischarge_Lima = '%')
    AND (d.ETA_PortOfDischarge LIKE @ETA_PortOfDischarge OR @ETA_PortOfDischarge = '%')
    AND (d.PackingMethod LIKE @PackingMethod OR @PackingMethod = '%')
    AND (d.TotalWeight LIKE @TotalWeight OR @TotalWeight = '%')
    AND (d.AdvertFlag LIKE @AdvertFlag OR @AdvertFlag = '%')
    AND (d.RealAdvertFlag LIKE @RealAdvertFlag OR @RealAdvertFlag = '%')
    AND (d.ETA_Delivery_Address_Update_TimeStamp LIKE @ETA_Delivery_Address_Update_TimeStamp OR @ETA_Delivery_Address_Update_TimeStamp = '%')
ORDER BY 
    CASE 
        WHEN @SortColumn = 'MBL_No' THEN tm.Wert
        WHEN @SortColumn = 'Container_No' THEN tm2.Wert
        WHEN @SortColumn = 'Status' THEN d.Status
        WHEN @SortColumn = 'TransmissionTimestamp' THEN d.TransmissionTimestamp
        WHEN @SortColumn = 'Voyage' THEN d.Voyage
        WHEN @SortColumn = 'ContainerSize' THEN d.ContainerSize
        WHEN @SortColumn = 'Broker' THEN d.Broker
        WHEN @SortColumn = 'Carrier' THEN d.Carrier
        WHEN @SortColumn = 'Vessel' THEN d.Vessel
        WHEN @SortColumn = 'PortOfDischarge_Lima' THEN d.PortOfDischarge_Lima
        WHEN @SortColumn = 'ETA_PortOfDischarge' THEN d.ETA_PortOfDischarge
        WHEN @SortColumn = 'PackingMethod' THEN d.PackingMethod
        WHEN @SortColumn = 'TotalWeight' THEN d.TotalWeight
        WHEN @SortColumn = 'AdvertFlag' THEN d.AdvertFlag
        WHEN @SortColumn = 'RealAdvertFlag' THEN d.RealAdvertFlag
        WHEN @SortColumn = 'ETA_Delivery_Address_Update_TimeStamp' THEN d.ETA_Delivery_Address_Update_TimeStamp
        ELSE tm.Wert -- Default sort
    END ASC,
    CASE 
        WHEN @SortColumn = 'MBL_No' AND @SortDirection = 'DESC' THEN tm.Wert
        WHEN @SortColumn = 'Container_No' AND @SortDirection = 'DESC' THEN tm2.Wert
        WHEN @SortColumn = 'Status' AND @SortDirection = 'DESC' THEN d.Status
        WHEN @SortColumn = 'TransmissionTimestamp' AND @SortDirection = 'DESC' THEN d.TransmissionTimestamp
        WHEN @SortColumn = 'Voyage' AND @SortDirection = 'DESC' THEN d.Voyage
        WHEN @SortColumn = 'ContainerSize' AND @SortDirection = 'DESC' THEN d.ContainerSize
        WHEN @SortColumn = 'Broker' AND @SortDirection = 'DESC' THEN d.Broker
        WHEN @SortColumn = 'Carrier' AND @SortDirection = 'DESC' THEN d.Carrier
        WHEN @SortColumn = 'Vessel' AND @SortDirection = 'DESC' THEN d.Vessel
        WHEN @SortColumn = 'PortOfDischarge_Lima' AND @SortDirection = 'DESC' THEN d.PortOfDischarge_Lima
        WHEN @SortColumn = 'ETA_PortOfDischarge' AND @SortDirection = 'DESC' THEN d.ETA_PortOfDischarge
        WHEN @SortColumn = 'PackingMethod' AND @SortDirection = 'DESC' THEN d.PackingMethod
        WHEN @SortColumn = 'TotalWeight' AND @SortDirection = 'DESC' THEN d.TotalWeight
        WHEN @SortColumn = 'AdvertFlag' AND @SortDirection = 'DESC' THEN d.AdvertFlag
        WHEN @SortColumn = 'RealAdvertFlag' AND @SortDirection = 'DESC' THEN d.RealAdvertFlag
        WHEN @SortColumn = 'ETA_Delivery_Address_Update_TimeStamp' AND @SortDirection = 'DESC' THEN d.ETA_Delivery_Address_Update_TimeStamp
    END DESC
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROW Re ONLY;