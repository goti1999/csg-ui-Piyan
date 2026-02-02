DECLARE @PageNumber INT = {{ui.ontable11.paginationOffset}} / {{ui.ontable11.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable11.pageSize}};
DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

DECLARE @SortColumn NVARCHAR(100) = '{{ui.ontable11.sort[0]?.column ?? "TransmissionTimestamp"}}';
DECLARE @SortDirection NVARCHAR(4) = UPPER('{{ui.ontable11.sort[0]?.direction ?? "DESC"}}');

IF @SortDirection NOT IN ('ASC', 'DESC')
    SET @SortDirection = 'DESC'; -- fallback for safety

DECLARE @sql NVARCHAR(MAX) = N'
;WITH HistoryCTE AS (
    SELECT 
        h.Container_Number,
        h.Timestamp,
        ROW_NUMBER() OVER (
            PARTITION BY h.Container_Number 
            ORDER BY h.Timestamp ASC
        ) AS rn
    FROM dbo.Transport_Dispo_History h
    WHERE h.ATA_Terminal_Inland IS NOT NULL
)
SELECT
  COUNT(*) OVER() AS TotalCount,
  d.to_Customer,
  d.to_Transporter,
  d.Status_Dispo,
  d.Status_Transport,
  d.Condition,
  tm.Wert AS MBL_No,
  tm2.Wert AS Container_No,
  d.TransmissionTimestamp,
  d.ContainerSize,
  d.Carrier,
  d.Vessel,
  d.AdvertFlag,
  d.RealAdvertFlag,
  d.EarliestAdvertDate,
  d.ETA_PortOfDischarge,
  d.Broker,
  d.Direct_Truck,
  d.ATA_Seaport,
  d.PortOfDischarge_UNLOCO,
  d.Terminal_PortOfDischarge,
  d.Pincode,
  d.ATD_Pickup_PortOfDischarge,
  d.ETA_Terminal_Inland,
  d.ATA_Terminal_Inland,
  d.ETA_DeliveryAddress,
  d.ATA_DeliveryAddress,
  d.Terminal_Inland_Vorgabe_NTL,
  d.DeliveryAddress,
  d.DropOff_Terminal,
  d.DropOff_Terminal_TIR,
  d.ATA_DropOff_Terminal,
  d.Transport_Mode_final_DeliveryAddress,
  d.Transport_Mode_Terminal,
  d.Terminal_Inland_CundA,
  d.Terminal_Inland_CTV,
  d.CustomerID,
  d.MBL_ID,
  d.transport_Dispo_ID,
  d.ContainerID,
  ft.Timestamp AS FirstTimestamp
FROM dbo.transport_UI AS d
INNER JOIN dbo.Transport_Mapping tm
    ON tm.Schluessel = d.MBL_ID AND tm.Typ = ''M''
INNER JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID AND tm2.Typ = ''C''
LEFT JOIN HistoryCTE ft
    ON ft.Container_Number = tm2.Wert AND ft.rn = 1
WHERE
  (d.Delivered = 0 OR d.Delivered IS NULL)
  AND NOT (
    d.Status_Transport = ''transportAssignmentCancellation''
    AND d.Status_Dispo IS NULL
  )
ORDER BY ' + QUOTENAME(@SortColumn) + ' ' + @SortDirection + '
OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
';

EXEC sp_executesql 
    @sql, 
    N'@Offset INT, @PageSize INT', 
    @Offset = @Offset, 
    @PageSize = @PageSize;
