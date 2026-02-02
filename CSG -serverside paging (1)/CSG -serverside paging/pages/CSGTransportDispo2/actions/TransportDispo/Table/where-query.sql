 -- String filters (with empty support)
  AND (
    {{ ui.ontable4.filters.Status_Transport ?? "" }} = ''
    OR d.Status_Transport LIKE '%' + {{ ui.ontable4.filters.Status_Transport }} + '%'
    OR (
      {{ ui.ontable4.filters.Status_Transport }} = 'empty'
      AND (d.Status_Transport IS NULL OR d.Status_Transport = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.MBL_No ?? "" }} = ''
    OR tm.Wert LIKE '%' + {{ ui.ontable4.filters.MBL_No }} + '%'
    OR (
      {{ ui.ontable4.filters.MBL_No }} = 'empty'
      AND (tm.Wert IS NULL OR tm.Wert = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Container_No ?? "" }} = ''
    OR tm2.Wert LIKE '%' + {{ ui.ontable4.filters.Container_No }} + '%'
    OR (
      {{ ui.ontable4.filters.Container_No }} = 'empty'
      AND (tm2.Wert IS NULL OR tm2.Wert = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Carrier ?? "" }} = ''
    OR d.Carrier LIKE '%' + {{ ui.ontable4.filters.Carrier }} + '%'
    OR (
      {{ ui.ontable4.filters.Carrier }} = 'empty'
      AND (d.Carrier IS NULL OR d.Carrier = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Vessel ?? "" }} = ''
    OR d.Vessel LIKE '%' + {{ ui.ontable4.filters.Vessel }} + '%'
    OR (
      {{ ui.ontable4.filters.Vessel }} = 'empty'
      AND (d.Vessel IS NULL OR d.Vessel = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.ContainerSize ?? "" }} = ''
    OR d.ContainerSize LIKE '%' + {{ ui.ontable4.filters.ContainerSize }} + '%'
    OR (
      {{ ui.ontable4.filters.ContainerSize }} = 'empty'
      AND (d.ContainerSize IS NULL OR d.ContainerSize = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Broker ?? "" }} = ''
    OR d.Broker LIKE '%' + {{ ui.ontable4.filters.Broker }} + '%'
    OR (
      {{ ui.ontable4.filters.Broker }} = 'empty'
      AND (d.Broker IS NULL OR d.Broker = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Voyage ?? "" }} = ''
    OR d.Voyage LIKE '%' + {{ ui.ontable4.filters.Voyage }} + '%'
    OR (
      {{ ui.ontable4.filters.Voyage }} = 'empty'
      AND (d.Voyage IS NULL OR d.Voyage = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.PackingMethod ?? "" }} = ''
    OR d.PackingMethod LIKE '%' + {{ ui.ontable4.filters.PackingMethod }} + '%'
    OR (
      {{ ui.ontable4.filters.PackingMethod }} = 'empty'
      AND (d.PackingMethod IS NULL OR d.PackingMethod = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.TotalWeight ?? "" }} = ''
    OR d.TotalWeight LIKE '%' + {{ ui.ontable4.filters.TotalWeight }} + '%'
    OR (
      {{ ui.ontable4.filters.TotalWeight }} = 'empty'
      AND (d.TotalWeight IS NULL OR d.TotalWeight = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Transport_Mode_final_DeliveryAddress ?? "" }} = ''
    OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + {{ ui.ontable4.filters.Transport_Mode_final_DeliveryAddress }} + '%'
    OR (
      {{ ui.ontable4.filters.Transport_Mode_final_DeliveryAddress }} = 'empty'
      AND (d.Transport_Mode_final_DeliveryAddress IS NULL OR d.Transport_Mode_final_DeliveryAddress = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Transport_Mode_Terminal ?? "" }} = ''
    OR d.Transport_Mode_Terminal LIKE '%' + {{ ui.ontable4.filters.Transport_Mode_Terminal }} + '%'
    OR (
      {{ ui.ontable4.filters.Transport_Mode_Terminal }} = 'empty'
      AND (d.Transport_Mode_Terminal IS NULL OR d.Transport_Mode_Terminal = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Terminal_Inland_CundA ?? "" }} = ''
    OR d.Terminal_Inland_CundA LIKE '%' + {{ ui.ontable4.filters.Terminal_Inland_CundA }} + '%'
    OR (
      {{ ui.ontable4.filters.Terminal_Inland_CundA }} = 'empty'
      AND (d.Terminal_Inland_CundA IS NULL OR d.Terminal_Inland_CundA = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Terminal_Inland_CTV ?? "" }} = ''
    OR d.Terminal_Inland_CTV LIKE '%' + {{ ui.ontable4.filters.Terminal_Inland_CTV }} + '%'
    OR (
      {{ ui.ontable4.filters.Terminal_Inland_CTV }} = 'empty'
      AND (d.Terminal_Inland_CTV IS NULL OR d.Terminal_Inland_CTV = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.DropOff_Terminal ?? "" }} = ''
    OR d.DropOff_Terminal LIKE '%' + {{ ui.ontable4.filters.DropOff_Terminal }} + '%'
    OR (
      {{ ui.ontable4.filters.DropOff_Terminal }} = 'empty'
      AND (d.DropOff_Terminal IS NULL OR d.DropOff_Terminal = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Terminal_Inland_Vorgabe_NTL ?? "" }} = ''
    OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + {{ ui.ontable4.filters.Terminal_Inland_Vorgabe_NTL }} + '%'
    OR (
      {{ ui.ontable4.filters.Terminal_Inland_Vorgabe_NTL }} = 'empty'
      AND (d.Terminal_Inland_Vorgabe_NTL IS NULL OR d.Terminal_Inland_Vorgabe_NTL = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.DropOff_Terminal_TIR ?? "" }} = ''
    OR d.DropOff_Terminal_TIR LIKE '%' + {{ ui.ontable4.filters.DropOff_Terminal_TIR }} + '%'
    OR (
      {{ ui.ontable4.filters.DropOff_Terminal_TIR }} = 'empty'
      AND (d.DropOff_Terminal_TIR IS NULL OR d.DropOff_Terminal_TIR = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Pincode ?? "" }} = ''
    OR d.Pincode LIKE '%' + {{ ui.ontable4.filters.Pincode }} + '%'
    OR (
      {{ ui.ontable4.filters.Pincode }} = 'empty'
      AND (d.Pincode IS NULL OR d.Pincode = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Condition ?? "" }} = ''
    OR d.Condition LIKE '%' + {{ ui.ontable4.filters.Condition }} + '%'
    OR (
      {{ ui.ontable4.filters.Condition }} = 'empty'
      AND (d.Condition IS NULL OR d.Condition = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Terminal_PortOfDischarge ?? "" }} = ''
    OR d.Terminal_PortOfDischarge LIKE '%' + {{ ui.ontable4.filters.Terminal_PortOfDischarge }} + '%'
    OR (
      {{ ui.ontable4.filters.Terminal_PortOfDischarge }} = 'empty'
      AND (d.Terminal_PortOfDischarge IS NULL OR d.Terminal_PortOfDischarge = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.Status_Dispo ?? "" }} = ''
    OR d.Status_Dispo LIKE '%' + {{ ui.ontable4.filters.Status_Dispo }} + '%'
    OR (
      {{ ui.ontable4.filters.Status_Dispo }} = 'empty'
      AND (d.Status_Dispo IS NULL OR d.Status_Dispo = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.CustomerID ?? "" }} = ''
    OR d.CustomerID LIKE '%' + {{ ui.ontable4.filters.CustomerID }} + '%'
    OR (
      {{ ui.ontable4.filters.CustomerID }} = 'empty'
      AND (d.CustomerID IS NULL OR d.CustomerID = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.MBL_ID ?? "" }} = ''
    OR d.MBL_ID LIKE '%' + {{ ui.ontable4.filters.MBL_ID }} + '%'
    OR (
      {{ ui.ontable4.filters.MBL_ID }} = 'empty'
      AND (d.MBL_ID IS NULL OR d.MBL_ID = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.transport_Dispo_ID ?? "" }} = ''
    OR d.transport_Dispo_ID LIKE '%' + {{ ui.ontable4.filters.transport_Dispo_ID }} + '%'
    OR (
      {{ ui.ontable4.filters.transport_Dispo_ID }} = 'empty'
      AND (d.transport_Dispo_ID IS NULL OR d.transport_Dispo_ID = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.ContainerID ?? "" }} = ''
    OR d.ContainerID LIKE '%' + {{ ui.ontable4.filters.ContainerID }} + '%'
    OR (
      {{ ui.ontable4.filters.ContainerID }} = 'empty'
      AND (d.ContainerID IS NULL OR d.ContainerID = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.PortOfDischarge_UNLOCO ?? "" }} = ''
    OR d.PortOfDischarge_UNLOCO LIKE '%' + {{ ui.ontable4.filters.PortOfDischarge_UNLOCO }} + '%'
    OR (
      {{ ui.ontable4.filters.PortOfDischarge_UNLOCO }} = 'empty'
      AND (d.PortOfDischarge_UNLOCO IS NULL OR d.PortOfDischarge_UNLOCO = '')
    )
  )
  AND (
    {{ ui.ontable4.filters.DeliveryAddress ?? "" }} = ''
    OR d.DeliveryAddress LIKE '%' + {{ ui.ontable4.filters.DeliveryAddress }} + '%'
    OR (
      {{ ui.ontable4.filters.DeliveryAddress }} = 'empty'
      AND (d.DeliveryAddress IS NULL OR d.DeliveryAddress = '')
    )
  )
 --bit
 
   AND (
    {{ ui.ontable4.filters.AdvertFlag }} IS NULL
    OR d.AdvertFlag = {{ ui.ontable4.filters.AdvertFlag }}
  )
  AND (
    {{ ui.ontable4.filters.RealAdvertFlag }} IS NULL
    OR d.RealAdvertFlag = {{ ui.ontable4.filters.RealAdvertFlag }}
  )
  AND (
    {{ ui.ontable4.filters.Direct_Truck }} IS NULL
    OR d.Direct_Truck = {{ ui.ontable4.filters.Direct_Truck }}
  )
  AND (
    {{ ui.ontable4.filters.to_Customer }} IS NULL
    OR d.to_Customer = {{ ui.ontable4.filters.to_Customer }}
  )
  AND (
    {{ ui.ontable4.filters.to_Transporter }} IS NULL
    OR d.to_Transporter = {{ ui.ontable4.filters.to_Transporter }}
  )
  
  -- DateTime filters
  AND (
  {{ ui.ontable4.filters.EarliestAdvertDate ?? "" }} = ''
  OR FORMAT(d.EarliestAdvertDate, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.EarliestAdvertDate ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.EarliestAdvertDate }} = 'empty'
    AND d.EarliestAdvertDate IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.ETA_PortOfDischarge ?? "" }} = ''
  OR FORMAT(d.ETA_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.ETA_PortOfDischarge ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.ETA_PortOfDischarge }} = 'empty'
    AND d.ETA_PortOfDischarge IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.ETA_Terminal_Inland ?? "" }} = ''
  OR FORMAT(d.ETA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.ETA_Terminal_Inland ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.ETA_Terminal_Inland }} = 'empty'
    AND d.ETA_Terminal_Inland IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.ATA_Terminal_Inland ?? "" }} = ''
  OR FORMAT(d.ATA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.ATA_Terminal_Inland ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.ATA_Terminal_Inland }} = 'empty'
    AND d.ATA_Terminal_Inland IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.ETA_DeliveryAddress ?? "" }} = ''
  OR FORMAT(d.ETA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.ETA_DeliveryAddress ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.ETA_DeliveryAddress }} = 'empty'
    AND d.ETA_DeliveryAddress IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.ATA_DeliveryAddress ?? "" }} = ''
  OR FORMAT(d.ATA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.ATA_DeliveryAddress ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.ATA_DeliveryAddress }} = 'empty'
    AND d.ATA_DeliveryAddress IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.FirstTimestamp ?? "" }} = ''
  OR FORMAT(ft.Timestamp, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.FirstTimestamp ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.FirstTimestamp }} = 'empty'
    AND ft.Timestamp IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.ATA_DropOff_Terminal ?? "" }} = ''
  OR FORMAT(d.ATA_DropOff_Terminal, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.ATA_DropOff_Terminal ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.ATA_DropOff_Terminal }} = 'empty'
    AND d.ATA_DropOff_Terminal IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.TransmissionTimestamp ?? "" }} = ''
  OR FORMAT(d.TransmissionTimestamp, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.TransmissionTimestamp ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.TransmissionTimestamp }} = 'empty'
    AND d.TransmissionTimestamp IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.ATD_Pickup_PortOfDischarge ?? "" }} = ''
  OR FORMAT(d.ATD_Pickup_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.ATD_Pickup_PortOfDischarge ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.ATD_Pickup_PortOfDischarge }} = 'empty'
    AND d.ATD_Pickup_PortOfDischarge IS NULL
  )
)
AND (
  {{ ui.ontable4.filters.ATA_Seaport ?? "" }} = ''
  OR FORMAT(d.ATA_Seaport, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable4.filters.ATA_Seaport ?? "" }} + '%'
  OR (
    {{ ui.ontable4.filters.ATA_Seaport }} = 'empty'
    AND d.ATA_Seaport IS NULL
  )
)