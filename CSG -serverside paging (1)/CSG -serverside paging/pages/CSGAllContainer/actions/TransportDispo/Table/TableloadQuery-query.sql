DECLARE @PageSize INT = {{ ui.ontable.pageSize }};
DECLARE @Offset INT = {{ ui.ontable.paginationOffset }};

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
  d.ETD_PortOfLoading,
  d.ETA_Service_Provider,
  d.ATD_Terminal_Inland,
  d.ATD_Seaport,
  d.ETD_Seaport,
  d.ETA_Seaport,
  d.CTV_ETA_PortOfDischarge,
  d.ETD_Pickup_PortOfDischarge,
  d.DeliveryInfo_send_to_CTV,
  d.ETA_Deliveryadress_CTV,
  d.transport_Dispo_ID,
  d.ContainerID,
  ft.Timestamp AS FirstTimestamp
FROM dbo.transport_UI AS d
INNER JOIN dbo.Transport_Mapping tm
    ON tm.Schluessel = d.MBL_ID AND tm.Typ = 'M'
INNER JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID AND tm2.Typ = 'C'
LEFT JOIN HistoryCTE ft
    ON ft.Container_Number = tm2.Wert AND ft.rn = 1
WHERE
  (d.Delivered = 0 OR d.Delivered IS NULL)
  AND NOT (
    d.Status_Transport = 'transportAssignmentCancellation'
    AND d.Status_Dispo IS NULL
  )

  -- String filters (with empty support)
  AND (
    '{{ ui.ontable.filters.Status_Transport ?? "" }}' = ''
    OR d.Status_Transport = '{{ ui.ontable.filters.Status_Transport }}'
    OR ('{{ ui.ontable.filters.Status_Transport }}' = 'empty' AND (d.Status_Transport IS NULL OR d.Status_Transport = ''))
)

AND (
    '{{ ui.ontable.filters.MBL_No ?? "" }}' = ''
    OR tm.Wert LIKE CONCAT('%', '{{ ui.ontable.filters.MBL_No }}', '%')
    OR ('{{ ui.ontable.filters.MBL_No }}' = 'empty' AND (tm.Wert IS NULL OR tm.Wert = ''))
)

AND (
    '{{ ui.ontable.filters.Container_No ?? "" }}' = ''
    OR tm2.Wert LIKE CONCAT('%', '{{ ui.ontable.filters.Container_No }}', '%')
    OR ('{{ ui.ontable.filters.Container_No }}' = 'empty' AND (tm2.Wert IS NULL OR tm2.Wert = ''))
)

AND (
    '{{ ui.ontable.filters.Carrier ?? "" }}' = ''
    OR d.Carrier LIKE CONCAT('%', '{{ ui.ontable.filters.Carrier }}', '%')
    OR ('{{ ui.ontable.filters.Carrier }}' = 'empty' AND (d.Carrier IS NULL OR d.Carrier = ''))
)

AND (
    '{{ ui.ontable.filters.Vessel ?? "" }}' = ''
    OR d.Vessel LIKE CONCAT('%', '{{ ui.ontable.filters.Vessel }}', '%')
    OR ('{{ ui.ontable.filters.Vessel }}' = 'empty' AND (d.Vessel IS NULL OR d.Vessel = ''))
)

AND (
    '{{ ui.ontable.filters.ContainerSize ?? "" }}' = ''
    OR d.ContainerSize LIKE '%' + '{{ ui.ontable.filters.ContainerSize }}' + '%'
    OR ('{{ ui.ontable.filters.ContainerSize }}' = 'empty' AND (d.ContainerSize IS NULL OR d.ContainerSize = ''))
)

AND (
    '{{ ui.ontable.filters.Broker ?? "" }}' = ''
    OR d.Broker LIKE '%' + '{{ ui.ontable.filters.Broker }}' + '%'
    OR ('{{ ui.ontable.filters.Broker }}' = 'empty' AND (d.Broker IS NULL OR d.Broker = ''))
)

AND (
    '{{ ui.ontable.filters.Voyage ?? "" }}' = ''
    OR d.Voyage LIKE '%' + '{{ ui.ontable.filters.Voyage }}' + '%'
    OR ('{{ ui.ontable.filters.Voyage }}' = 'empty' AND (d.Voyage IS NULL OR d.Voyage = ''))
)

AND (
    '{{ ui.ontable.filters.PackingMethod ?? "" }}' = ''
    OR d.PackingMethod LIKE '%' + '{{ ui.ontable.filters.PackingMethod }}' + '%'
    OR ('{{ ui.ontable.filters.PackingMethod }}' = 'empty' AND (d.PackingMethod IS NULL OR d.PackingMethod = ''))
)

AND (
    '{{ ui.ontable.filters.TotalWeight ?? "" }}' = ''
    OR d.TotalWeight LIKE '%' + '{{ ui.ontable.filters.TotalWeight }}' + '%'
    OR ('{{ ui.ontable.filters.TotalWeight }}' = 'empty' AND (d.TotalWeight IS NULL OR d.TotalWeight = ''))
)

AND (
    '{{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress ?? "" }}' = ''
    OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + '{{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress }}' + '%'
    OR ('{{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress }}' = 'empty' AND (d.Transport_Mode_final_DeliveryAddress IS NULL OR d.Transport_Mode_final_DeliveryAddress = ''))
)

AND (
    '{{ ui.ontable.filters.Transport_Mode_Terminal ?? "" }}' = ''
    OR d.Transport_Mode_Terminal LIKE '%' + '{{ ui.ontable.filters.Transport_Mode_Terminal }}' + '%'
    OR ('{{ ui.ontable.filters.Transport_Mode_Terminal }}' = 'empty' AND (d.Transport_Mode_Terminal IS NULL OR d.Transport_Mode_Terminal = ''))
)

AND (
    '{{ ui.ontable.filters.Terminal_Inland_CundA ?? "" }}' = ''
    OR d.Terminal_Inland_CundA = '{{ ui.ontable.filters.Terminal_Inland_CundA }}'
    OR ('{{ ui.ontable.filters.Terminal_Inland_CundA }}' = 'empty' AND (d.Terminal_Inland_CundA IS NULL OR d.Terminal_Inland_CundA = ''))
)

AND (
    '{{ ui.ontable.filters.Terminal_Inland_CTV ?? "" }}' = ''
    OR d.Terminal_Inland_CTV LIKE '%' + '{{ ui.ontable.filters.Terminal_Inland_CTV }}' + '%'
    OR ('{{ ui.ontable.filters.Terminal_Inland_CTV }}' = 'empty' AND (d.Terminal_Inland_CTV IS NULL OR d.Terminal_Inland_CTV = ''))
)

AND (
    '{{ ui.ontable.filters.DropOff_Terminal ?? "" }}' = ''
    OR d.DropOff_Terminal LIKE '%' + '{{ ui.ontable.filters.DropOff_Terminal }}' + '%'
    OR ('{{ ui.ontable.filters.DropOff_Terminal }}' = 'empty' AND (d.DropOff_Terminal IS NULL OR d.DropOff_Terminal = ''))
)

AND (
    '{{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL ?? "" }}' = ''
    OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + '{{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL }}' + '%'
    OR ('{{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL }}' = 'empty' AND (d.Terminal_Inland_Vorgabe_NTL IS NULL OR d.Terminal_Inland_Vorgabe_NTL = ''))
)

AND (
    '{{ ui.ontable.filters.DropOff_Terminal_TIR ?? "" }}' = ''
    OR d.DropOff_Terminal_TIR LIKE '%' + '{{ ui.ontable.filters.DropOff_Terminal_TIR }}' + '%'
    OR ('{{ ui.ontable.filters.DropOff_Terminal_TIR }}' = 'empty' AND (d.DropOff_Terminal_TIR IS NULL OR d.DropOff_Terminal_TIR = ''))
)

AND (
    '{{ ui.ontable.filters.Pincode ?? "" }}' = ''
    OR d.Pincode LIKE '%' + '{{ ui.ontable.filters.Pincode }}' + '%'
    OR ('{{ ui.ontable.filters.Pincode }}' = 'empty' AND (d.Pincode IS NULL OR d.Pincode = ''))
)

AND (
    '{{ ui.ontable.filters.Condition ?? "" }}' = ''
    OR d.Condition = '{{ ui.ontable.filters.Condition }}'
    OR ('{{ ui.ontable.filters.Condition }}' = 'empty' AND (d.Condition IS NULL OR d.Condition = ''))
)

AND (
    '{{ ui.ontable.filters.Terminal_PortOfDischarge ?? "" }}' = ''
    OR d.Terminal_PortOfDischarge LIKE '%' + '{{ ui.ontable.filters.Terminal_PortOfDischarge }}' + '%'
    OR ('{{ ui.ontable.filters.Terminal_PortOfDischarge }}' = 'empty' AND (d.Terminal_PortOfDischarge IS NULL OR d.Terminal_PortOfDischarge = ''))
)

AND (
    '{{ ui.ontable.filters.Status_Dispo ?? "" }}' = ''
    OR d.Status_Dispo = '{{ ui.ontable.filters.Status_Dispo }}'
    OR ('{{ ui.ontable.filters.Status_Dispo }}' = 'empty' AND (d.Status_Dispo IS NULL OR d.Status_Dispo = ''))
)

AND (
    '{{ ui.ontable.filters.PortOfDischarge_UNLOCO ?? "" }}' = ''
    OR d.PortOfDischarge_UNLOCO LIKE '%' + '{{ ui.ontable.filters.PortOfDischarge_UNLOCO }}' + '%'
    OR ('{{ ui.ontable.filters.PortOfDischarge_UNLOCO }}' = 'empty' AND (d.PortOfDischarge_UNLOCO IS NULL OR d.PortOfDischarge_UNLOCO = ''))
)

AND (
    '{{ ui.ontable.filters.DeliveryAddress ?? "" }}' = ''
    OR d.DeliveryAddress LIKE '%' + '{{ ui.ontable.filters.DeliveryAddress }}' + '%'
    OR ('{{ ui.ontable.filters.DeliveryAddress }}' = 'empty' AND (d.DeliveryAddress IS NULL OR d.DeliveryAddress = ''))
)

-- ✅ Bit Columns
AND (
    '{{ ui.ontable.filters.AdvertFlag ?? "" }}' = ''
    OR d.AdvertFlag = '{{ ui.ontable.filters.AdvertFlag }}'
)
AND (
    '{{ ui.ontable.filters.RealAdvertFlag ?? "" }}' = ''
    OR d.RealAdvertFlag = '{{ ui.ontable.filters.RealAdvertFlag }}'
)
AND (
    '{{ ui.ontable.filters.Direct_Truck ?? "" }}' = ''
    OR d.Direct_Truck = '{{ ui.ontable.filters.Direct_Truck }}'
)
AND (
    '{{ ui.ontable.filters.to_Customer ?? "" }}' = ''
    OR d.to_Customer = '{{ ui.ontable.filters.to_Customer }}'
)
AND (
    '{{ ui.ontable.filters.to_Transporter ?? "" }}' = ''
    OR d.to_Transporter = '{{ ui.ontable.filters.to_Transporter }}'
)

-- ✅ DateTime Columns
AND (
    '{{ ui.ontable.filters.EarliestAdvertDate ?? "" }}' = ''
    OR FORMAT(d.EarliestAdvertDate, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.EarliestAdvertDate }}' + '%'
    OR ('{{ ui.ontable.filters.EarliestAdvertDate }}' = 'empty' AND d.EarliestAdvertDate IS NULL)
)
AND (
    '{{ ui.ontable.filters.ETA_PortOfDischarge ?? "" }}' = ''
    OR FORMAT(d.ETA_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.ETA_PortOfDischarge }}' + '%'
    OR ('{{ ui.ontable.filters.ETA_PortOfDischarge }}' = 'empty' AND d.ETA_PortOfDischarge IS NULL)
)
AND (
    '{{ ui.ontable.filters.ETA_Terminal_Inland ?? "" }}' = ''
    OR FORMAT(d.ETA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.ETA_Terminal_Inland }}' + '%'
    OR ('{{ ui.ontable.filters.ETA_Terminal_Inland }}' = 'empty' AND d.ETA_Terminal_Inland IS NULL)
)
AND (
    '{{ ui.ontable.filters.ATA_Terminal_Inland ?? "" }}' = ''
    OR FORMAT(d.ATA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.ATA_Terminal_Inland }}' + '%'
    OR ('{{ ui.ontable.filters.ATA_Terminal_Inland }}' = 'empty' AND d.ATA_Terminal_Inland IS NULL)
)
AND (
    '{{ ui.ontable.filters.ETA_DeliveryAddress ?? "" }}' = ''
    OR FORMAT(d.ETA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.ETA_DeliveryAddress }}' + '%'
    OR ('{{ ui.ontable.filters.ETA_DeliveryAddress }}' = 'empty' AND d.ETA_DeliveryAddress IS NULL)
)
AND (
    '{{ ui.ontable.filters.ATA_DeliveryAddress ?? "" }}' = ''
    OR FORMAT(d.ATA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.ATA_DeliveryAddress }}' + '%'
    OR ('{{ ui.ontable.filters.ATA_DeliveryAddress }}' = 'empty' AND d.ATA_DeliveryAddress IS NULL)
)
AND (
    '{{ ui.ontable.filters.FirstTimestamp ?? "" }}' = ''
    OR FORMAT(ft.Timestamp, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.FirstTimestamp }}' + '%'
    OR ('{{ ui.ontable.filters.FirstTimestamp }}' = 'empty' AND ft.Timestamp IS NULL)
)
AND (
    '{{ ui.ontable.filters.ATA_DropOff_Terminal ?? "" }}' = ''
    OR FORMAT(d.ATA_DropOff_Terminal, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.ATA_DropOff_Terminal }}' + '%'
    OR ('{{ ui.ontable.filters.ATA_DropOff_Terminal }}' = 'empty' AND d.ATA_DropOff_Terminal IS NULL)
)
AND (
    '{{ ui.ontable.filters.TransmissionTimestamp ?? "" }}' = ''
    OR FORMAT(d.TransmissionTimestamp, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.TransmissionTimestamp }}' + '%'
    OR ('{{ ui.ontable.filters.TransmissionTimestamp }}' = 'empty' AND d.TransmissionTimestamp IS NULL)
)
AND (
    '{{ ui.ontable.filters.ATD_Pickup_PortOfDischarge ?? "" }}' = ''
    OR FORMAT(d.ATD_Pickup_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.ATD_Pickup_PortOfDischarge }}' + '%'
    OR ('{{ ui.ontable.filters.ATD_Pickup_PortOfDischarge }}' = 'empty' AND d.ATD_Pickup_PortOfDischarge IS NULL)
)
AND (
    '{{ ui.ontable.filters.ATA_Seaport ?? "" }}' = ''
    OR FORMAT(d.ATA_Seaport, 'dd-MM-yyyy') LIKE '%' + '{{ ui.ontable.filters.ATA_Seaport }}' + '%'
    OR ('{{ ui.ontable.filters.ATA_Seaport }}' = 'empty' AND d.ATA_Seaport IS NULL)
)

ORDER BY
    CASE 
        WHEN '{{ ui.ontable.sortColumn ?? "TransmissionTimestamp" }}' = 'Status_Transport' THEN d.Status_Transport COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Condition" }}' = 'Condition' THEN d.Condition COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "MBL_No" }}' = 'MBL_No' THEN tm.Wert COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Container_No" }}' = 'Container_No' THEN tm2.Wert COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Carrier" }}' = 'Carrier' THEN d.Carrier COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Vessel" }}' = 'Vessel' THEN d.Vessel COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "ContainerSize" }}' = 'ContainerSize' THEN d.ContainerSize COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Broker" }}' = 'Broker' THEN d.Broker COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Voyage" }}' = 'Voyage' THEN d.Voyage COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "PackingMethod" }}' = 'PackingMethod' THEN d.PackingMethod COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "TotalWeight" }}' = 'TotalWeight' THEN CONVERT(NVARCHAR(100), d.TotalWeight)
        WHEN '{{ ui.ontable.sortColumn ?? "Transport_Mode_final_DeliveryAddress" }}' = 'Transport_Mode_final_DeliveryAddress' THEN d.Transport_Mode_final_DeliveryAddress COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Transport_Mode_Terminal" }}' = 'Transport_Mode_Terminal' THEN d.Transport_Mode_Terminal COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Terminal_Inland_CundA" }}' = 'Terminal_Inland_CundA' THEN d.Terminal_Inland_CundA COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Terminal_Inland_CTV" }}' = 'Terminal_Inland_CTV' THEN d.Terminal_Inland_CTV COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "DropOff_Terminal" }}' = 'DropOff_Terminal' THEN d.DropOff_Terminal COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Terminal_Inland_Vorgabe_NTL" }}' = 'Terminal_Inland_Vorgabe_NTL' THEN d.Terminal_Inland_Vorgabe_NTL COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "DropOff_Terminal_TIR" }}' = 'DropOff_Terminal_TIR' THEN d.DropOff_Terminal_TIR COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Pincode" }}' = 'Pincode' THEN d.Pincode COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "PortOfDischarge_UNLOCO" }}' = 'PortOfDischarge_UNLOCO' THEN d.PortOfDischarge_UNLOCO COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "Terminal_PortOfDischarge" }}' = 'Terminal_PortOfDischarge' THEN d.Terminal_PortOfDischarge COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "DeliveryAddress" }}' = 'DeliveryAddress' THEN d.DeliveryAddress COLLATE Latin1_General_CI_AS
        WHEN '{{ ui.ontable.sortColumn ?? "AdvertFlag" }}' = 'AdvertFlag' THEN CONVERT(NVARCHAR(100), d.AdvertFlag)
        WHEN '{{ ui.ontable.sortColumn ?? "RealAdvertFlag" }}' = 'RealAdvertFlag' THEN CONVERT(NVARCHAR(100), d.RealAdvertFlag)
        WHEN '{{ ui.ontable.sortColumn ?? "Direct_Truck" }}' = 'Direct_Truck' THEN CONVERT(NVARCHAR(100), d.Direct_Truck)
        WHEN '{{ ui.ontable.sortColumn ?? "to_Customer" }}' = 'to_Customer' THEN CONVERT(NVARCHAR(100), d.to_Customer)
        WHEN '{{ ui.ontable.sortColumn ?? "to_Transporter" }}' = 'to_Transporter' THEN CONVERT(NVARCHAR(100), d.to_Transporter)
        WHEN '{{ ui.ontable.sortColumn ?? "EarliestAdvertDate" }}' = 'EarliestAdvertDate' THEN CONVERT(NVARCHAR(100), d.EarliestAdvertDate, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "ETA_PortOfDischarge" }}' = 'ETA_PortOfDischarge' THEN CONVERT(NVARCHAR(100), d.ETA_PortOfDischarge, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "ETA_Terminal_Inland" }}' = 'ETA_Terminal_Inland' THEN CONVERT(NVARCHAR(100), d.ETA_Terminal_Inland, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "ATA_Terminal_Inland" }}' = 'ATA_Terminal_Inland' THEN CONVERT(NVARCHAR(100), d.ATA_Terminal_Inland, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "ETA_DeliveryAddress" }}' = 'ETA_DeliveryAddress' THEN CONVERT(NVARCHAR(100), d.ETA_DeliveryAddress, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "ATA_DeliveryAddress" }}' = 'ATA_DeliveryAddress' THEN CONVERT(NVARCHAR(100), d.ATA_DeliveryAddress, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "FirstTimestamp" }}' = 'FirstTimestamp' THEN CONVERT(NVARCHAR(100), ft.Timestamp, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "ATA_DropOff_Terminal" }}' = 'ATA_DropOff_Terminal' THEN CONVERT(NVARCHAR(100), d.ATA_DropOff_Terminal, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "TransmissionTimestamp" }}' = 'TransmissionTimestamp' THEN CONVERT(NVARCHAR(100), d.TransmissionTimestamp, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "ATD_Pickup_PortOfDischarge" }}' = 'ATD_Pickup_PortOfDischarge' THEN CONVERT(NVARCHAR(100), d.ATD_Pickup_PortOfDischarge, 120)
        WHEN '{{ ui.ontable.sortColumn ?? "ATA_Seaport" }}' = 'ATA_Seaport' THEN CONVERT(NVARCHAR(100), d.ATA_Seaport, 120)
        ELSE CONVERT(NVARCHAR(100), d.TransmissionTimestamp)
    END
    {{ ui.ontable.sortDirection ?? 'DESC' }}
OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

