 -- String filters (with empty support)
  AND (
    :param0 = ''
    OR d.Status_Transport LIKE '%' + :param1 + '%'
    OR (
      :param2 = 'empty'
      AND (d.Status_Transport IS NULL OR d.Status_Transport = '')
    )
  )
  AND (
    :param3 = ''
    OR tm.Wert LIKE '%' + :param4 + '%'
    OR (
      :param5 = 'empty'
      AND (tm.Wert IS NULL OR tm.Wert = '')
    )
  )
  AND (
    :param6 = ''
    OR tm2.Wert LIKE '%' + :param7 + '%'
    OR (
      :param8 = 'empty'
      AND (tm2.Wert IS NULL OR tm2.Wert = '')
    )
  )
  AND (
    :param9 = ''
    OR d.Carrier LIKE '%' + :param10 + '%'
    OR (
      :param11 = 'empty'
      AND (d.Carrier IS NULL OR d.Carrier = '')
    )
  )
  AND (
    :param12 = ''
    OR d.Vessel LIKE '%' + :param13 + '%'
    OR (
      :param14 = 'empty'
      AND (d.Vessel IS NULL OR d.Vessel = '')
    )
  )
  AND (
    :param15 = ''
    OR d.ContainerSize LIKE '%' + :param16 + '%'
    OR (
      :param17 = 'empty'
      AND (d.ContainerSize IS NULL OR d.ContainerSize = '')
    )
  )
  AND (
    :param18 = ''
    OR d.Broker LIKE '%' + :param19 + '%'
    OR (
      :param20 = 'empty'
      AND (d.Broker IS NULL OR d.Broker = '')
    )
  )
  AND (
    :param21 = ''
    OR d.Voyage LIKE '%' + :param22 + '%'
    OR (
      :param23 = 'empty'
      AND (d.Voyage IS NULL OR d.Voyage = '')
    )
  )
  AND (
    :param24 = ''
    OR d.PackingMethod LIKE '%' + :param25 + '%'
    OR (
      :param26 = 'empty'
      AND (d.PackingMethod IS NULL OR d.PackingMethod = '')
    )
  )
  AND (
    :param27 = ''
    OR d.TotalWeight LIKE '%' + :param28 + '%'
    OR (
      :param29 = 'empty'
      AND (d.TotalWeight IS NULL OR d.TotalWeight = '')
    )
  )
  AND (
    :param30 = ''
    OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + :param31 + '%'
    OR (
      :param32 = 'empty'
      AND (d.Transport_Mode_final_DeliveryAddress IS NULL OR d.Transport_Mode_final_DeliveryAddress = '')
    )
  )
  AND (
    :param33 = ''
    OR d.Transport_Mode_Terminal LIKE '%' + :param34 + '%'
    OR (
      :param35 = 'empty'
      AND (d.Transport_Mode_Terminal IS NULL OR d.Transport_Mode_Terminal = '')
    )
  )
  AND (
    :param36 = ''
    OR d.Terminal_Inland_CundA LIKE '%' + :param37 + '%'
    OR (
      :param38 = 'empty'
      AND (d.Terminal_Inland_CundA IS NULL OR d.Terminal_Inland_CundA = '')
    )
  )
  AND (
    :param39 = ''
    OR d.Terminal_Inland_CTV LIKE '%' + :param40 + '%'
    OR (
      :param41 = 'empty'
      AND (d.Terminal_Inland_CTV IS NULL OR d.Terminal_Inland_CTV = '')
    )
  )
  AND (
    :param42 = ''
    OR d.DropOff_Terminal LIKE '%' + :param43 + '%'
    OR (
      :param44 = 'empty'
      AND (d.DropOff_Terminal IS NULL OR d.DropOff_Terminal = '')
    )
  )
  AND (
    :param45 = ''
    OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + :param46 + '%'
    OR (
      :param47 = 'empty'
      AND (d.Terminal_Inland_Vorgabe_NTL IS NULL OR d.Terminal_Inland_Vorgabe_NTL = '')
    )
  )
  AND (
    :param48 = ''
    OR d.DropOff_Terminal_TIR LIKE '%' + :param49 + '%'
    OR (
      :param50 = 'empty'
      AND (d.DropOff_Terminal_TIR IS NULL OR d.DropOff_Terminal_TIR = '')
    )
  )
  AND (
    :param51 = ''
    OR d.Pincode LIKE '%' + :param52 + '%'
    OR (
      :param53 = 'empty'
      AND (d.Pincode IS NULL OR d.Pincode = '')
    )
  )
  AND (
    :param54 = ''
    OR d.Condition LIKE '%' + :param55 + '%'
    OR (
      :param56 = 'empty'
      AND (d.Condition IS NULL OR d.Condition = '')
    )
  )
  AND (
    :param57 = ''
    OR d.Terminal_PortOfDischarge LIKE '%' + :param58 + '%'
    OR (
      :param59 = 'empty'
      AND (d.Terminal_PortOfDischarge IS NULL OR d.Terminal_PortOfDischarge = '')
    )
  )
  AND (
    :param60 = ''
    OR d.Status_Dispo LIKE '%' + :param61 + '%'
    OR (
      :param62 = 'empty'
      AND (d.Status_Dispo IS NULL OR d.Status_Dispo = '')
    )
  )
  AND (
    :param63 = ''
    OR d.CustomerID LIKE '%' + :param64 + '%'
    OR (
      :param65 = 'empty'
      AND (d.CustomerID IS NULL OR d.CustomerID = '')
    )
  )
  AND (
    :param66 = ''
    OR d.MBL_ID LIKE '%' + :param67 + '%'
    OR (
      :param68 = 'empty'
      AND (d.MBL_ID IS NULL OR d.MBL_ID = '')
    )
  )
  AND (
    :param69 = ''
    OR d.transport_Dispo_ID LIKE '%' + :param70 + '%'
    OR (
      :param71 = 'empty'
      AND (d.transport_Dispo_ID IS NULL OR d.transport_Dispo_ID = '')
    )
  )
  AND (
    :param72 = ''
    OR d.ContainerID LIKE '%' + :param73 + '%'
    OR (
      :param74 = 'empty'
      AND (d.ContainerID IS NULL OR d.ContainerID = '')
    )
  )
  AND (
    :param75 = ''
    OR d.PortOfDischarge_UNLOCO LIKE '%' + :param76 + '%'
    OR (
      :param77 = 'empty'
      AND (d.PortOfDischarge_UNLOCO IS NULL OR d.PortOfDischarge_UNLOCO = '')
    )
  )
  AND (
    :param78 = ''
    OR d.DeliveryAddress LIKE '%' + :param79 + '%'
    OR (
      :param80 = 'empty'
      AND (d.DeliveryAddress IS NULL OR d.DeliveryAddress = '')
    )
  )
 --bit
 
   AND (
    :param81 IS NULL
    OR d.AdvertFlag = :param82
  )
  AND (
    :param83 IS NULL
    OR d.RealAdvertFlag = :param84
  )
  AND (
    :param85 IS NULL
    OR d.Direct_Truck = :param86
  )
  AND (
    :param87 IS NULL
    OR d.to_Customer = :param88
  )
  AND (
    :param89 IS NULL
    OR d.to_Transporter = :param90
  )
  
  -- DateTime filters
  AND (
  :param91 = ''
  OR FORMAT(d.EarliestAdvertDate, 'dd-MM-yyyy') LIKE '%' + :param92 + '%'
  OR (
    :param93 = 'empty'
    AND d.EarliestAdvertDate IS NULL
  )
)
AND (
  :param94 = ''
  OR FORMAT(d.ETA_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + :param95 + '%'
  OR (
    :param96 = 'empty'
    AND d.ETA_PortOfDischarge IS NULL
  )
)
AND (
  :param97 = ''
  OR FORMAT(d.ETA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + :param98 + '%'
  OR (
    :param99 = 'empty'
    AND d.ETA_Terminal_Inland IS NULL
  )
)
AND (
  :param100 = ''
  OR FORMAT(d.ATA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + :param101 + '%'
  OR (
    :param102 = 'empty'
    AND d.ATA_Terminal_Inland IS NULL
  )
)
AND (
  :param103 = ''
  OR FORMAT(d.ETA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + :param104 + '%'
  OR (
    :param105 = 'empty'
    AND d.ETA_DeliveryAddress IS NULL
  )
)
AND (
  :param106 = ''
  OR FORMAT(d.ATA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + :param107 + '%'
  OR (
    :param108 = 'empty'
    AND d.ATA_DeliveryAddress IS NULL
  )
)
AND (
  :param109 = ''
  OR FORMAT(ft.Timestamp, 'dd-MM-yyyy') LIKE '%' + :param110 + '%'
  OR (
    :param111 = 'empty'
    AND ft.Timestamp IS NULL
  )
)
AND (
  :param112 = ''
  OR FORMAT(d.ATA_DropOff_Terminal, 'dd-MM-yyyy') LIKE '%' + :param113 + '%'
  OR (
    :param114 = 'empty'
    AND d.ATA_DropOff_Terminal IS NULL
  )
)
AND (
  :param115 = ''
  OR FORMAT(d.TransmissionTimestamp, 'dd-MM-yyyy') LIKE '%' + :param116 + '%'
  OR (
    :param117 = 'empty'
    AND d.TransmissionTimestamp IS NULL
  )
)
AND (
  :param118 = ''
  OR FORMAT(d.ATD_Pickup_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + :param119 + '%'
  OR (
    :param120 = 'empty'
    AND d.ATD_Pickup_PortOfDischarge IS NULL
  )
)
AND (
  :param121 = ''
  OR FORMAT(d.ATA_Seaport, 'dd-MM-yyyy') LIKE '%' + :param122 + '%'
  OR (
    :param123 = 'empty'
    AND d.ATA_Seaport IS NULL
  )
)