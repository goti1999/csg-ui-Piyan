DECLARE 
    @PageNumber INT = 1,
    @PageSize INT = 30,
    @SortColumn NVARCHAR(50) = 'TransmissionTimestamp',  -- column to sort
    @SortDirection NVARCHAR(4) = 'ASC';                  -- ASC or DESC

-- Example filters: replace with UI parameters
DECLARE 
    @to_Customer NVARCHAR(100) = NULL,
    @to_Transporter NVARCHAR(100) = NULL,
    @Status_Dispo NVARCHAR(50) = NULL,
    @Status_Transport NVARCHAR(50) = NULL,
    @ContainerSize NVARCHAR(50) = NULL,
    @Carrier NVARCHAR(100) = NULL,
    @Vessel NVARCHAR(100) = NULL,
    @MBL_No NVARCHAR(100) = NULL,
    @Container_No NVARCHAR(100) = NULL,
    @Broker NVARCHAR(100) = NULL,
    @DropOff_Terminal NVARCHAR(50) = NULL,
    @Terminal_Inland_Vorgabe_NTL NVARCHAR(50) = NULL,
    @Terminal_Inland_CundA NVARCHAR(50) = NULL,
    @Terminal_Inland_CTV NVARCHAR(50) = NULL,
    @Pincode NVARCHAR(50) = NULL,
    @Condition NVARCHAR(100) = NULL,
    @Terminal_PortOfDischarge NVARCHAR(50) = NULL,
    @CustomerID NVARCHAR(50) = NULL,
    @MBL_ID NVARCHAR(50) = NULL,
    @transport_Dispo_ID NVARCHAR(50) = NULL,
    @ContainerID NVARCHAR(50) = NULL,
    @PortOfDischarge_UNLOCO NVARCHAR(50) = NULL,
    @DeliveryAddress NVARCHAR(200) = NULL,
    @AdvertFlag BIT = NULL,
    @RealAdvertFlag BIT = NULL,
    @Direct_Truck BIT = NULL,
    @EarliestAdvertDateFrom DATE = NULL,
    @EarliestAdvertDateTo DATE = NULL;

DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
IF @Offset < 0 SET @Offset = 0;

;WITH HistoryCTE AS (
    SELECT 
        h.Container_Number,
        h.Timestamp,
        ROW_NUMBER() OVER (PARTITION BY h.Container_Number ORDER BY h.Timestamp ASC) AS rn
    FROM dbo.Transport_Dispo_History h
    WHERE h.ATA_Terminal_Inland IS NOT NULL
)
SELECT
    COUNT(*) OVER() AS TotalCount,
    d.*,
    tm.Wert AS MBL_No,
    tm2.Wert AS Container_No,
    ft.Timestamp AS FirstTimestamp
FROM dbo.transport_UI AS d
INNER JOIN dbo.Transport_Mapping tm
    ON tm.Schluessel = d.MBL_ID AND tm.Typ = 'M'
INNER JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID AND tm2.Typ = 'C'
LEFT JOIN HistoryCTE ft
    ON ft.Container_Number = tm2.Wert AND ft.rn = 1
WHERE (d.Delivered = 0 OR d.Delivered IS NULL)
  AND NOT (d.Status_Transport = 'transportAssignmentCancellation' AND d.Status_Dispo IS NULL)

  -- Filters for all columns
  AND (@to_Customer IS NULL OR d.to_Customer LIKE '%' + @to_Customer + '%')
  AND (@to_Transporter IS NULL OR d.to_Transporter LIKE '%' + @to_Transporter + '%')
  AND (@Status_Dispo IS NULL OR d.Status_Dispo LIKE '%' + @Status_Dispo + '%')
  AND (@Status_Transport IS NULL OR d.Status_Transport LIKE '%' + @Status_Transport + '%')
  AND (@ContainerSize IS NULL OR d.ContainerSize LIKE '%' + @ContainerSize + '%')
  AND (@Carrier IS NULL OR d.Carrier LIKE '%' + @Carrier + '%')
  AND (@Vessel IS NULL OR d.Vessel LIKE '%' + @Vessel + '%')
  AND (@MBL_No IS NULL OR tm.Wert LIKE '%' + @MBL_No + '%')
  AND (@Container_No IS NULL OR tm2.Wert LIKE '%' + @Container_No + '%')
  AND (@Broker IS NULL OR d.Broker LIKE '%' + @Broker + '%')
  AND (@DropOff_Terminal IS NULL OR d.DropOff_Terminal LIKE '%' + @DropOff_Terminal + '%')
  AND (@Terminal_Inland_Vorgabe_NTL IS NULL OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + @Terminal_Inland_Vorgabe_NTL + '%')
  AND (@Terminal_Inland_CundA IS NULL OR d.Terminal_Inland_CundA LIKE '%' + @Terminal_Inland_CundA + '%')
  AND (@Terminal_Inland_CTV IS NULL OR d.Terminal_Inland_CTV LIKE '%' + @Terminal_Inland_CTV + '%')
  AND (@Pincode IS NULL OR d.Pincode LIKE '%' + @Pincode + '%')
  AND (@Condition IS NULL OR d.Condition LIKE '%' + @Condition + '%')
  AND (@Terminal_PortOfDischarge IS NULL OR d.Terminal_PortOfDischarge LIKE '%' + @Terminal_PortOfDischarge + '%')
  AND (@CustomerID IS NULL OR d.CustomerID LIKE '%' + @CustomerID + '%')
  AND (@MBL_ID IS NULL OR d.MBL_ID LIKE '%' + @MBL_ID + '%')
  AND (@transport_Dispo_ID IS NULL OR d.transport_Dispo_ID LIKE '%' + @transport_Dispo_ID + '%')
  AND (@ContainerID IS NULL OR d.ContainerID LIKE '%' + @ContainerID + '%')
  AND (@PortOfDischarge_UNLOCO IS NULL OR d.PortOfDischarge_UNLOCO LIKE '%' + @PortOfDischarge_UNLOCO + '%')
  AND (@DeliveryAddress IS NULL OR d.DeliveryAddress LIKE '%' + @DeliveryAddress + '%')
  AND (@AdvertFlag IS NULL OR d.AdvertFlag = @AdvertFlag)
  AND (@RealAdvertFlag IS NULL OR d.RealAdvertFlag = @RealAdvertFlag)
  AND (@Direct_Truck IS NULL OR d.Direct_Truck = @Direct_Truck)
  AND (@EarliestAdvertDateFrom IS NULL OR d.EarliestAdvertDate >= @EarliestAdvertDateFrom)
  AND (@EarliestAdvertDateTo IS NULL OR d.EarliestAdvertDate <= @EarliestAdvertDateTo)

ORDER BY 
    CASE 
        WHEN @SortColumn = 'to_Customer' THEN d.to_Customer
        WHEN @SortColumn = 'to_Transporter' THEN d.to_Transporter
        WHEN @SortColumn = 'Status_Dispo' THEN d.Status_Dispo
        WHEN @SortColumn = 'Status_Transport' THEN d.Status_Transport
        WHEN @SortColumn = 'MBL_No' THEN tm.Wert
        WHEN @SortColumn = 'Container_No' THEN tm2.Wert
        WHEN @SortColumn = 'TransmissionTimestamp' THEN d.TransmissionTimestamp
        -- Add other columns here as needed
        ELSE d.TransmissionTimestamp
    END
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
