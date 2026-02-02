DECLARE @PageSize INT = :param0;
DECLARE @Offset INT = :param1;

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
    ':param2' = ''
    OR d.Status_Transport = ':param3'
    OR (':param4' = 'empty' AND (d.Status_Transport IS NULL OR d.Status_Transport = ''))
)

AND (
    ':param5' = ''
    OR tm.Wert LIKE CONCAT('%', ':param6', '%')
    OR (':param7' = 'empty' AND (tm.Wert IS NULL OR tm.Wert = ''))
)

AND (
    ':param8' = ''
    OR tm2.Wert LIKE CONCAT('%', ':param9', '%')
    OR (':param10' = 'empty' AND (tm2.Wert IS NULL OR tm2.Wert = ''))
)

AND (
    ':param11' = ''
    OR d.Carrier LIKE CONCAT('%', ':param12', '%')
    OR (':param13' = 'empty' AND (d.Carrier IS NULL OR d.Carrier = ''))
)

AND (
    ':param14' = ''
    OR d.Vessel LIKE CONCAT('%', ':param15', '%')
    OR (':param16' = 'empty' AND (d.Vessel IS NULL OR d.Vessel = ''))
)

AND (
    ':param17' = ''
    OR d.ContainerSize LIKE '%' + ':param18' + '%'
    OR (':param19' = 'empty' AND (d.ContainerSize IS NULL OR d.ContainerSize = ''))
)

AND (
    ':param20' = ''
    OR d.Broker LIKE '%' + ':param21' + '%'
    OR (':param22' = 'empty' AND (d.Broker IS NULL OR d.Broker = ''))
)

AND (
    ':param23' = ''
    OR d.Voyage LIKE '%' + ':param24' + '%'
    OR (':param25' = 'empty' AND (d.Voyage IS NULL OR d.Voyage = ''))
)

AND (
    ':param26' = ''
    OR d.PackingMethod LIKE '%' + ':param27' + '%'
    OR (':param28' = 'empty' AND (d.PackingMethod IS NULL OR d.PackingMethod = ''))
)

AND (
    ':param29' = ''
    OR d.TotalWeight LIKE '%' + ':param30' + '%'
    OR (':param31' = 'empty' AND (d.TotalWeight IS NULL OR d.TotalWeight = ''))
)

AND (
    ':param32' = ''
    OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + ':param33' + '%'
    OR (':param34' = 'empty' AND (d.Transport_Mode_final_DeliveryAddress IS NULL OR d.Transport_Mode_final_DeliveryAddress = ''))
)

AND (
    ':param35' = ''
    OR d.Transport_Mode_Terminal LIKE '%' + ':param36' + '%'
    OR (':param37' = 'empty' AND (d.Transport_Mode_Terminal IS NULL OR d.Transport_Mode_Terminal = ''))
)

AND (
    ':param38' = ''
    OR d.Terminal_Inland_CundA = ':param39'
    OR (':param40' = 'empty' AND (d.Terminal_Inland_CundA IS NULL OR d.Terminal_Inland_CundA = ''))
)

AND (
    ':param41' = ''
    OR d.Terminal_Inland_CTV LIKE '%' + ':param42' + '%'
    OR (':param43' = 'empty' AND (d.Terminal_Inland_CTV IS NULL OR d.Terminal_Inland_CTV = ''))
)

AND (
    ':param44' = ''
    OR d.DropOff_Terminal LIKE '%' + ':param45' + '%'
    OR (':param46' = 'empty' AND (d.DropOff_Terminal IS NULL OR d.DropOff_Terminal = ''))
)

AND (
    ':param47' = ''
    OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + ':param48' + '%'
    OR (':param49' = 'empty' AND (d.Terminal_Inland_Vorgabe_NTL IS NULL OR d.Terminal_Inland_Vorgabe_NTL = ''))
)

AND (
    ':param50' = ''
    OR d.DropOff_Terminal_TIR LIKE '%' + ':param51' + '%'
    OR (':param52' = 'empty' AND (d.DropOff_Terminal_TIR IS NULL OR d.DropOff_Terminal_TIR = ''))
)

AND (
    ':param53' = ''
    OR d.Pincode LIKE '%' + ':param54' + '%'
    OR (':param55' = 'empty' AND (d.Pincode IS NULL OR d.Pincode = ''))
)

AND (
    ':param56' = ''
    OR d.Condition = ':param57'
    OR (':param58' = 'empty' AND (d.Condition IS NULL OR d.Condition = ''))
)

AND (
    ':param59' = ''
    OR d.Terminal_PortOfDischarge LIKE '%' + ':param60' + '%'
    OR (':param61' = 'empty' AND (d.Terminal_PortOfDischarge IS NULL OR d.Terminal_PortOfDischarge = ''))
)

AND (
    ':param62' = ''
    OR d.Status_Dispo = ':param63'
    OR (':param64' = 'empty' AND (d.Status_Dispo IS NULL OR d.Status_Dispo = ''))
)

AND (
    ':param65' = ''
    OR d.PortOfDischarge_UNLOCO LIKE '%' + ':param66' + '%'
    OR (':param67' = 'empty' AND (d.PortOfDischarge_UNLOCO IS NULL OR d.PortOfDischarge_UNLOCO = ''))
)

AND (
    ':param68' = ''
    OR d.DeliveryAddress LIKE '%' + ':param69' + '%'
    OR (':param70' = 'empty' AND (d.DeliveryAddress IS NULL OR d.DeliveryAddress = ''))
)

-- ✅ Bit Columns
AND (
    ':param71' = ''
    OR d.AdvertFlag = ':param72'
)
AND (
    ':param73' = ''
    OR d.RealAdvertFlag = ':param74'
)
AND (
    ':param75' = ''
    OR d.Direct_Truck = ':param76'
)
AND (
    ':param77' = ''
    OR d.to_Customer = ':param78'
)
AND (
    ':param79' = ''
    OR d.to_Transporter = ':param80'
)

-- ✅ DateTime Columns
AND (
    ':param81' = ''
    OR FORMAT(d.EarliestAdvertDate, 'dd-MM-yyyy') LIKE '%' + ':param82' + '%'
    OR (':param83' = 'empty' AND d.EarliestAdvertDate IS NULL)
)
AND (
    ':param84' = ''
    OR FORMAT(d.ETA_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + ':param85' + '%'
    OR (':param86' = 'empty' AND d.ETA_PortOfDischarge IS NULL)
)
AND (
    ':param87' = ''
    OR FORMAT(d.ETA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + ':param88' + '%'
    OR (':param89' = 'empty' AND d.ETA_Terminal_Inland IS NULL)
)
AND (
    ':param90' = ''
    OR FORMAT(d.ATA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + ':param91' + '%'
    OR (':param92' = 'empty' AND d.ATA_Terminal_Inland IS NULL)
)
AND (
    ':param93' = ''
    OR FORMAT(d.ETA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + ':param94' + '%'
    OR (':param95' = 'empty' AND d.ETA_DeliveryAddress IS NULL)
)
AND (
    ':param96' = ''
    OR FORMAT(d.ATA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + ':param97' + '%'
    OR (':param98' = 'empty' AND d.ATA_DeliveryAddress IS NULL)
)
AND (
    ':param99' = ''
    OR FORMAT(ft.Timestamp, 'dd-MM-yyyy') LIKE '%' + ':param100' + '%'
    OR (':param101' = 'empty' AND ft.Timestamp IS NULL)
)
AND (
    ':param102' = ''
    OR FORMAT(d.ATA_DropOff_Terminal, 'dd-MM-yyyy') LIKE '%' + ':param103' + '%'
    OR (':param104' = 'empty' AND d.ATA_DropOff_Terminal IS NULL)
)
AND (
    ':param105' = ''
    OR FORMAT(d.TransmissionTimestamp, 'dd-MM-yyyy') LIKE '%' + ':param106' + '%'
    OR (':param107' = 'empty' AND d.TransmissionTimestamp IS NULL)
)
AND (
    ':param108' = ''
    OR FORMAT(d.ATD_Pickup_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + ':param109' + '%'
    OR (':param110' = 'empty' AND d.ATD_Pickup_PortOfDischarge IS NULL)
)
AND (
    ':param111' = ''
    OR FORMAT(d.ATA_Seaport, 'dd-MM-yyyy') LIKE '%' + ':param112' + '%'
    OR (':param113' = 'empty' AND d.ATA_Seaport IS NULL)
)

ORDER BY
    CASE 
        WHEN ':param114' = 'Status_Transport' THEN d.Status_Transport COLLATE Latin1_General_CI_AS
        WHEN ':param115' = 'Condition' THEN d.Condition COLLATE Latin1_General_CI_AS
        WHEN ':param116' = 'MBL_No' THEN tm.Wert COLLATE Latin1_General_CI_AS
        WHEN ':param117' = 'Container_No' THEN tm2.Wert COLLATE Latin1_General_CI_AS
        WHEN ':param118' = 'Carrier' THEN d.Carrier COLLATE Latin1_General_CI_AS
        WHEN ':param119' = 'Vessel' THEN d.Vessel COLLATE Latin1_General_CI_AS
        WHEN ':param120' = 'ContainerSize' THEN d.ContainerSize COLLATE Latin1_General_CI_AS
        WHEN ':param121' = 'Broker' THEN d.Broker COLLATE Latin1_General_CI_AS
        WHEN ':param122' = 'Voyage' THEN d.Voyage COLLATE Latin1_General_CI_AS
        WHEN ':param123' = 'PackingMethod' THEN d.PackingMethod COLLATE Latin1_General_CI_AS
        WHEN ':param124' = 'TotalWeight' THEN CONVERT(NVARCHAR(100), d.TotalWeight)
        WHEN ':param125' = 'Transport_Mode_final_DeliveryAddress' THEN d.Transport_Mode_final_DeliveryAddress COLLATE Latin1_General_CI_AS
        WHEN ':param126' = 'Transport_Mode_Terminal' THEN d.Transport_Mode_Terminal COLLATE Latin1_General_CI_AS
        WHEN ':param127' = 'Terminal_Inland_CundA' THEN d.Terminal_Inland_CundA COLLATE Latin1_General_CI_AS
        WHEN ':param128' = 'Terminal_Inland_CTV' THEN d.Terminal_Inland_CTV COLLATE Latin1_General_CI_AS
        WHEN ':param129' = 'DropOff_Terminal' THEN d.DropOff_Terminal COLLATE Latin1_General_CI_AS
        WHEN ':param130' = 'Terminal_Inland_Vorgabe_NTL' THEN d.Terminal_Inland_Vorgabe_NTL COLLATE Latin1_General_CI_AS
        WHEN ':param131' = 'DropOff_Terminal_TIR' THEN d.DropOff_Terminal_TIR COLLATE Latin1_General_CI_AS
        WHEN ':param132' = 'Pincode' THEN d.Pincode COLLATE Latin1_General_CI_AS
        WHEN ':param133' = 'PortOfDischarge_UNLOCO' THEN d.PortOfDischarge_UNLOCO COLLATE Latin1_General_CI_AS
        WHEN ':param134' = 'Terminal_PortOfDischarge' THEN d.Terminal_PortOfDischarge COLLATE Latin1_General_CI_AS
        WHEN ':param135' = 'DeliveryAddress' THEN d.DeliveryAddress COLLATE Latin1_General_CI_AS
        WHEN ':param136' = 'AdvertFlag' THEN CONVERT(NVARCHAR(100), d.AdvertFlag)
        WHEN ':param137' = 'RealAdvertFlag' THEN CONVERT(NVARCHAR(100), d.RealAdvertFlag)
        WHEN ':param138' = 'Direct_Truck' THEN CONVERT(NVARCHAR(100), d.Direct_Truck)
        WHEN ':param139' = 'to_Customer' THEN CONVERT(NVARCHAR(100), d.to_Customer)
        WHEN ':param140' = 'to_Transporter' THEN CONVERT(NVARCHAR(100), d.to_Transporter)
        WHEN ':param141' = 'EarliestAdvertDate' THEN CONVERT(NVARCHAR(100), d.EarliestAdvertDate, 120)
        WHEN ':param142' = 'ETA_PortOfDischarge' THEN CONVERT(NVARCHAR(100), d.ETA_PortOfDischarge, 120)
        WHEN ':param143' = 'ETA_Terminal_Inland' THEN CONVERT(NVARCHAR(100), d.ETA_Terminal_Inland, 120)
        WHEN ':param144' = 'ATA_Terminal_Inland' THEN CONVERT(NVARCHAR(100), d.ATA_Terminal_Inland, 120)
        WHEN ':param145' = 'ETA_DeliveryAddress' THEN CONVERT(NVARCHAR(100), d.ETA_DeliveryAddress, 120)
        WHEN ':param146' = 'ATA_DeliveryAddress' THEN CONVERT(NVARCHAR(100), d.ATA_DeliveryAddress, 120)
        WHEN ':param147' = 'FirstTimestamp' THEN CONVERT(NVARCHAR(100), ft.Timestamp, 120)
        WHEN ':param148' = 'ATA_DropOff_Terminal' THEN CONVERT(NVARCHAR(100), d.ATA_DropOff_Terminal, 120)
        WHEN ':param149' = 'TransmissionTimestamp' THEN CONVERT(NVARCHAR(100), d.TransmissionTimestamp, 120)
        WHEN ':param150' = 'ATD_Pickup_PortOfDischarge' THEN CONVERT(NVARCHAR(100), d.ATD_Pickup_PortOfDischarge, 120)
        WHEN ':param151' = 'ATA_Seaport' THEN CONVERT(NVARCHAR(100), d.ATA_Seaport, 120)
        ELSE CONVERT(NVARCHAR(100), d.TransmissionTimestamp)
    END
    :param152
OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

