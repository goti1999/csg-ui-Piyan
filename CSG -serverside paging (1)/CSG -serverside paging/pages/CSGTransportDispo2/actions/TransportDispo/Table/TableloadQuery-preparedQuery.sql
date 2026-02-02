DECLARE @PageNumber INT = :param0 / :param1 + 1;
DECLARE @PageSize INT = :param2;
DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

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
  AND d.Direct_Truck = 0
  AND d.Status_Transport = 'transportAssignment'
  AND d.Status_Dispo IS NULL
  -- String filters (with empty support)
  AND (
    :param3 = ''
    OR d.Status_Transport = :param4 
    OR (
      :param5 = 'empty'
      AND (d.Status_Transport IS NULL OR d.Status_Transport = '')
    )
  )
  AND (
    :param6 = ''
    OR tm.Wert LIKE '%' + :param7 + '%'
    OR (
      :param8 = 'empty'
      AND (tm.Wert IS NULL OR tm.Wert = '')
    )
  )
  AND (
    :param9 = ''
    OR tm2.Wert LIKE '%' + :param10 + '%'
    OR (
      :param11 = 'empty'
      AND (tm2.Wert IS NULL OR tm2.Wert = '')
    )
  )
  AND (
    :param12 = ''
    OR d.Carrier LIKE '%' + :param13 + '%'
    OR (
      :param14 = 'empty'
      AND (d.Carrier IS NULL OR d.Carrier = '')
    )
  )
  AND (
    :param15 = ''
    OR d.Vessel LIKE '%' + :param16 + '%'
    OR (
      :param17 = 'empty'
      AND (d.Vessel IS NULL OR d.Vessel = '')
    )
  )
  AND (
    :param18 = ''
    OR d.ContainerSize = :param19 
    OR (
      :param20 = 'empty'
      AND (d.ContainerSize IS NULL OR d.ContainerSize = '')
    )
  )
  AND (
    :param21 = ''
    OR d.Broker LIKE '%' + :param22 + '%'
    OR (
      :param23 = 'empty'
      AND (d.Broker IS NULL OR d.Broker = '')
    )
  )
  AND (
    :param24 = ''
    OR d.Voyage LIKE '%' + :param25 + '%'
    OR (
      :param26 = 'empty'
      AND (d.Voyage IS NULL OR d.Voyage = '')
    )
  )
  AND (
    :param27 = ''
    OR d.PackingMethod LIKE '%' + :param28 + '%'
    OR (
      :param29 = 'empty'
      AND (d.PackingMethod IS NULL OR d.PackingMethod = '')
    )
  )
  AND (
    :param30 = ''
    OR d.TotalWeight LIKE '%' + :param31 + '%'
    OR (
      :param32 = 'empty'
      AND (d.TotalWeight IS NULL OR d.TotalWeight = '')
    )
  )
  AND (
    :param33 = ''
    OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + :param34 + '%'
    OR (
      :param35 = 'empty'
      AND (d.Transport_Mode_final_DeliveryAddress IS NULL OR d.Transport_Mode_final_DeliveryAddress = '')
    )
  )
  AND (
    :param36 = ''
    OR d.Transport_Mode_Terminal LIKE '%' + :param37 + '%'
    OR (
      :param38 = 'empty'
      AND (d.Transport_Mode_Terminal IS NULL OR d.Transport_Mode_Terminal = '')
    )
  )
  AND (
    :param39 = ''
    OR d.Terminal_Inland_CundA LIKE '%' + :param40 + '%'
    OR (
      :param41 = 'empty'
      AND (d.Terminal_Inland_CundA IS NULL OR d.Terminal_Inland_CundA = '')
    )
  )
  AND (
    :param42 = ''
    OR d.Terminal_Inland_CTV LIKE '%' + :param43 + '%'
    OR (
      :param44 = 'empty'
      AND (d.Terminal_Inland_CTV IS NULL OR d.Terminal_Inland_CTV = '')
    )
  )
  AND (
    :param45 = ''
    OR d.DropOff_Terminal LIKE '%' + :param46 + '%'
    OR (
      :param47 = 'empty'
      AND (d.DropOff_Terminal IS NULL OR d.DropOff_Terminal = '')
    )
  )
  AND (
    :param48 = ''
    OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + :param49 + '%'
    OR (
      :param50 = 'empty'
      AND (d.Terminal_Inland_Vorgabe_NTL IS NULL OR d.Terminal_Inland_Vorgabe_NTL = '')
    )
  )
  AND (
    :param51 = ''
    OR d.DropOff_Terminal_TIR LIKE '%' + :param52 + '%'
    OR (
      :param53 = 'empty'
      AND (d.DropOff_Terminal_TIR IS NULL OR d.DropOff_Terminal_TIR = '')
    )
  )
  AND (
    :param54 = ''
    OR d.Pincode LIKE '%' + :param55 + '%'
    OR (
      :param56 = 'empty'
      AND (d.Pincode IS NULL OR d.Pincode = '')
    )
  )
  AND (
    :param57 = ''
    OR d.Condition = :param58 
    OR (
      :param59 = 'empty'
      AND (d.Condition IS NULL OR d.Condition = '')
    )
  )
  AND (
    :param60 = ''
    OR d.Terminal_PortOfDischarge LIKE '%' + :param61 + '%'
    OR (
      :param62 = 'empty'
      AND (d.Terminal_PortOfDischarge IS NULL OR d.Terminal_PortOfDischarge = '')
    )
  )
  AND (
  :param63 = ''
  OR d.Status_Dispo = :param64
  OR (
    :param65 = 'empty'
    AND (d.Status_Dispo IS NULL OR d.Status_Dispo = '')
  )
)

  AND (
    :param66 = ''
    OR d.CustomerID LIKE '%' + :param67 + '%'
    OR (
      :param68 = 'empty'
      AND (d.CustomerID IS NULL OR d.CustomerID = '')
    )
  )
  AND (
    :param69 = ''
    OR d.MBL_ID LIKE '%' + :param70 + '%'
    OR (
      :param71 = 'empty'
      AND (d.MBL_ID IS NULL OR d.MBL_ID = '')
    )
  )
  AND (
    :param72 = ''
    OR d.transport_Dispo_ID LIKE '%' + :param73 + '%'
    OR (
      :param74 = 'empty'
      AND (d.transport_Dispo_ID IS NULL OR d.transport_Dispo_ID = '')
    )
  )
  AND (
    :param75 = ''
    OR d.ContainerID LIKE '%' + :param76 + '%'
    OR (
      :param77 = 'empty'
      AND (d.ContainerID IS NULL OR d.ContainerID = '')
    )
  )
  AND (
    :param78 = ''
    OR d.PortOfDischarge_UNLOCO LIKE '%' + :param79 + '%'
    OR (
      :param80 = 'empty'
      AND (d.PortOfDischarge_UNLOCO IS NULL OR d.PortOfDischarge_UNLOCO = '')
    )
  )
  AND (
    :param81 = ''
    OR d.DeliveryAddress LIKE '%' + :param82 + '%'
    OR (
      :param83 = 'empty'
      AND (d.DeliveryAddress IS NULL OR d.DeliveryAddress = '')
    )
  )
 --bit
 
   AND (
    :param84 IS NULL
    OR d.AdvertFlag = :param85
  )
  AND (
    :param86 IS NULL
    OR d.RealAdvertFlag = :param87
  )
  AND (
    :param88 IS NULL
    OR d.Direct_Truck = :param89
  )
  AND (
    :param90 IS NULL
    OR d.to_Customer = :param91
  )
  AND (
    :param92 IS NULL
    OR d.to_Transporter = :param93
  )
  
  -- DateTime filters
  AND (
  :param94 = ''
  OR FORMAT(d.EarliestAdvertDate, 'dd-MM-yyyy') LIKE '%' + :param95 + '%'
  OR (
    :param96 = 'empty'
    AND d.EarliestAdvertDate IS NULL
  )
)
AND (
  :param97 = ''
  OR FORMAT(d.ETA_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + :param98 + '%'
  OR (
    :param99 = 'empty'
    AND d.ETA_PortOfDischarge IS NULL
  )
)
AND (
  :param100 = ''
  OR FORMAT(d.ETA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + :param101 + '%'
  OR (
    :param102 = 'empty'
    AND d.ETA_Terminal_Inland IS NULL
  )
)
AND (
  :param103 = ''
  OR FORMAT(d.ATA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + :param104 + '%'
  OR (
    :param105 = 'empty'
    AND d.ATA_Terminal_Inland IS NULL
  )
)
AND (
  :param106 = ''
  OR FORMAT(d.ETA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + :param107 + '%'
  OR (
    :param108 = 'empty'
    AND d.ETA_DeliveryAddress IS NULL
  )
)
AND (
  :param109 = ''
  OR FORMAT(d.ATA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + :param110 + '%'
  OR (
    :param111 = 'empty'
    AND d.ATA_DeliveryAddress IS NULL
  )
)
AND (
  :param112 = ''
  OR FORMAT(ft.Timestamp, 'dd-MM-yyyy') LIKE '%' + :param113 + '%'
  OR (
    :param114 = 'empty'
    AND ft.Timestamp IS NULL
  )
)
AND (
  :param115 = ''
  OR FORMAT(d.ATA_DropOff_Terminal, 'dd-MM-yyyy') LIKE '%' + :param116 + '%'
  OR (
    :param117 = 'empty'
    AND d.ATA_DropOff_Terminal IS NULL
  )
)
AND (
  :param118 = ''
  OR FORMAT(d.TransmissionTimestamp, 'dd-MM-yyyy') LIKE '%' + :param119 + '%'
  OR (
    :param120 = 'empty'
    AND d.TransmissionTimestamp IS NULL
  )
)
AND (
  :param121 = ''
  OR FORMAT(d.ATD_Pickup_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + :param122 + '%'
  OR (
    :param123 = 'empty'
    AND d.ATD_Pickup_PortOfDischarge IS NULL
  )
)
AND (
  :param124 = ''
  OR FORMAT(d.ATA_Seaport, 'dd-MM-yyyy') LIKE '%' + :param125 + '%'
  OR (
    :param126 = 'empty'
    AND d.ATA_Seaport IS NULL
  )
)


ORDER BY TransmissionTimestamp DESC  -- change ASC/DESC to test
OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

