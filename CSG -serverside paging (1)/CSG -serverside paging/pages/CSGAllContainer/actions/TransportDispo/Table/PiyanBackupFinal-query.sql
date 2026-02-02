DECLARE @PageNumber INT = {{ui.ontable.paginationOffset}} / {{ui.ontable.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable.pageSize}};
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

  -- String filters (with empty support)
  AND (
    {{ ui.ontable.filters.Status_Transport ?? "" }} = ''
    OR d.Status_Transport LIKE '%' + {{ ui.ontable.filters.Status_Transport }} + '%'
    OR (
      {{ ui.ontable.filters.Status_Transport }} = 'empty'
      AND (d.Status_Transport IS NULL OR d.Status_Transport = '')
    )
  )
  AND (
    {{ ui.ontable.filters.MBL_No ?? "" }} = ''
    OR tm.Wert LIKE '%' + {{ ui.ontable.filters.MBL_No }} + '%'
    OR (
      {{ ui.ontable.filters.MBL_No }} = 'empty'
      AND (tm.Wert IS NULL OR tm.Wert = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Container_No ?? "" }} = ''
    OR tm2.Wert LIKE '%' + {{ ui.ontable.filters.Container_No }} + '%'
    OR (
      {{ ui.ontable.filters.Container_No }} = 'empty'
      AND (tm2.Wert IS NULL OR tm2.Wert = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Carrier ?? "" }} = ''
    OR d.Carrier LIKE '%' + {{ ui.ontable.filters.Carrier }} + '%'
    OR (
      {{ ui.ontable.filters.Carrier }} = 'empty'
      AND (d.Carrier IS NULL OR d.Carrier = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Vessel ?? "" }} = ''
    OR d.Vessel LIKE '%' + {{ ui.ontable.filters.Vessel }} + '%'
    OR (
      {{ ui.ontable.filters.Vessel }} = 'empty'
      AND (d.Vessel IS NULL OR d.Vessel = '')
    )
  )
  AND (
    {{ ui.ontable.filters.ContainerSize ?? "" }} = ''
    OR d.ContainerSize LIKE '%' + {{ ui.ontable.filters.ContainerSize }} + '%'
    OR (
      {{ ui.ontable.filters.ContainerSize }} = 'empty'
      AND (d.ContainerSize IS NULL OR d.ContainerSize = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Broker ?? "" }} = ''
    OR d.Broker LIKE '%' + {{ ui.ontable.filters.Broker }} + '%'
    OR (
      {{ ui.ontable.filters.Broker }} = 'empty'
      AND (d.Broker IS NULL OR d.Broker = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Voyage ?? "" }} = ''
    OR d.Voyage LIKE '%' + {{ ui.ontable.filters.Voyage }} + '%'
    OR (
      {{ ui.ontable.filters.Voyage }} = 'empty'
      AND (d.Voyage IS NULL OR d.Voyage = '')
    )
  )
  AND (
    {{ ui.ontable.filters.PackingMethod ?? "" }} = ''
    OR d.PackingMethod LIKE '%' + {{ ui.ontable.filters.PackingMethod }} + '%'
    OR (
      {{ ui.ontable.filters.PackingMethod }} = 'empty'
      AND (d.PackingMethod IS NULL OR d.PackingMethod = '')
    )
  )
  AND (
    {{ ui.ontable.filters.TotalWeight ?? "" }} = ''
    OR d.TotalWeight LIKE '%' + {{ ui.ontable.filters.TotalWeight }} + '%'
    OR (
      {{ ui.ontable.filters.TotalWeight }} = 'empty'
      AND (d.TotalWeight IS NULL OR d.TotalWeight = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress ?? "" }} = ''
    OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + {{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress }} + '%'
    OR (
      {{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress }} = 'empty'
      AND (d.Transport_Mode_final_DeliveryAddress IS NULL OR d.Transport_Mode_final_DeliveryAddress = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Transport_Mode_Terminal ?? "" }} = ''
    OR d.Transport_Mode_Terminal LIKE '%' + {{ ui.ontable.filters.Transport_Mode_Terminal }} + '%'
    OR (
      {{ ui.ontable.filters.Transport_Mode_Terminal }} = 'empty'
      AND (d.Transport_Mode_Terminal IS NULL OR d.Transport_Mode_Terminal = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Terminal_Inland_CundA ?? "" }} = ''
    OR d.Terminal_Inland_CundA LIKE '%' + {{ ui.ontable.filters.Terminal_Inland_CundA }} + '%'
    OR (
      {{ ui.ontable.filters.Terminal_Inland_CundA }} = 'empty'
      AND (d.Terminal_Inland_CundA IS NULL OR d.Terminal_Inland_CundA = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Terminal_Inland_CTV ?? "" }} = ''
    OR d.Terminal_Inland_CTV LIKE '%' + {{ ui.ontable.filters.Terminal_Inland_CTV }} + '%'
    OR (
      {{ ui.ontable.filters.Terminal_Inland_CTV }} = 'empty'
      AND (d.Terminal_Inland_CTV IS NULL OR d.Terminal_Inland_CTV = '')
    )
  )
  AND (
    {{ ui.ontable.filters.DropOff_Terminal ?? "" }} = ''
    OR d.DropOff_Terminal LIKE '%' + {{ ui.ontable.filters.DropOff_Terminal }} + '%'
    OR (
      {{ ui.ontable.filters.DropOff_Terminal }} = 'empty'
      AND (d.DropOff_Terminal IS NULL OR d.DropOff_Terminal = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL ?? "" }} = ''
    OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + {{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL }} + '%'
    OR (
      {{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL }} = 'empty'
      AND (d.Terminal_Inland_Vorgabe_NTL IS NULL OR d.Terminal_Inland_Vorgabe_NTL = '')
    )
  )
  AND (
    {{ ui.ontable.filters.DropOff_Terminal_TIR ?? "" }} = ''
    OR d.DropOff_Terminal_TIR LIKE '%' + {{ ui.ontable.filters.DropOff_Terminal_TIR }} + '%'
    OR (
      {{ ui.ontable.filters.DropOff_Terminal_TIR }} = 'empty'
      AND (d.DropOff_Terminal_TIR IS NULL OR d.DropOff_Terminal_TIR = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Pincode ?? "" }} = ''
    OR d.Pincode LIKE '%' + {{ ui.ontable.filters.Pincode }} + '%'
    OR (
      {{ ui.ontable.filters.Pincode }} = 'empty'
      AND (d.Pincode IS NULL OR d.Pincode = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Condition ?? "" }} = ''
    OR d.Condition LIKE '%' + {{ ui.ontable.filters.Condition }} + '%'
    OR (
      {{ ui.ontable.filters.Condition }} = 'empty'
      AND (d.Condition IS NULL OR d.Condition = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Terminal_PortOfDischarge ?? "" }} = ''
    OR d.Terminal_PortOfDischarge LIKE '%' + {{ ui.ontable.filters.Terminal_PortOfDischarge }} + '%'
    OR (
      {{ ui.ontable.filters.Terminal_PortOfDischarge }} = 'empty'
      AND (d.Terminal_PortOfDischarge IS NULL OR d.Terminal_PortOfDischarge = '')
    )
  )
  AND (
    {{ ui.ontable.filters.Status_Dispo ?? "" }} = ''
    OR d.Status_Dispo LIKE '%' + {{ ui.ontable.filters.Status_Dispo }} + '%'
    OR (
      {{ ui.ontable.filters.Status_Dispo }} = 'empty'
      AND (d.Status_Dispo IS NULL OR d.Status_Dispo = '')
    )
  )
  AND (
    {{ ui.ontable.filters.CustomerID ?? "" }} = ''
    OR d.CustomerID LIKE '%' + {{ ui.ontable.filters.CustomerID }} + '%'
    OR (
      {{ ui.ontable.filters.CustomerID }} = 'empty'
      AND (d.CustomerID IS NULL OR d.CustomerID = '')
    )
  )
  AND (
    {{ ui.ontable.filters.MBL_ID ?? "" }} = ''
    OR d.MBL_ID LIKE '%' + {{ ui.ontable.filters.MBL_ID }} + '%'
    OR (
      {{ ui.ontable.filters.MBL_ID }} = 'empty'
      AND (d.MBL_ID IS NULL OR d.MBL_ID = '')
    )
  )
  AND (
    {{ ui.ontable.filters.transport_Dispo_ID ?? "" }} = ''
    OR d.transport_Dispo_ID LIKE '%' + {{ ui.ontable.filters.transport_Dispo_ID }} + '%'
    OR (
      {{ ui.ontable.filters.transport_Dispo_ID }} = 'empty'
      AND (d.transport_Dispo_ID IS NULL OR d.transport_Dispo_ID = '')
    )
  )
  AND (
    {{ ui.ontable.filters.ContainerID ?? "" }} = ''
    OR d.ContainerID LIKE '%' + {{ ui.ontable.filters.ContainerID }} + '%'
    OR (
      {{ ui.ontable.filters.ContainerID }} = 'empty'
      AND (d.ContainerID IS NULL OR d.ContainerID = '')
    )
  )
  AND (
    {{ ui.ontable.filters.PortOfDischarge_UNLOCO ?? "" }} = ''
    OR d.PortOfDischarge_UNLOCO LIKE '%' + {{ ui.ontable.filters.PortOfDischarge_UNLOCO }} + '%'
    OR (
      {{ ui.ontable.filters.PortOfDischarge_UNLOCO }} = 'empty'
      AND (d.PortOfDischarge_UNLOCO IS NULL OR d.PortOfDischarge_UNLOCO = '')
    )
  )
  AND (
    {{ ui.ontable.filters.DeliveryAddress ?? "" }} = ''
    OR d.DeliveryAddress LIKE '%' + {{ ui.ontable.filters.DeliveryAddress }} + '%'
    OR (
      {{ ui.ontable.filters.DeliveryAddress }} = 'empty'
      AND (d.DeliveryAddress IS NULL OR d.DeliveryAddress = '')
    )
  )
 --bit
 
   AND (
    {{ ui.ontable.filters.AdvertFlag }} IS NULL
    OR d.AdvertFlag = {{ ui.ontable.filters.AdvertFlag }}
  )
  AND (
    {{ ui.ontable.filters.RealAdvertFlag }} IS NULL
    OR d.RealAdvertFlag = {{ ui.ontable.filters.RealAdvertFlag }}
  )
  AND (
    {{ ui.ontable.filters.Direct_Truck }} IS NULL
    OR d.Direct_Truck = {{ ui.ontable.filters.Direct_Truck }}
  )
  AND (
    {{ ui.ontable.filters.to_Customer }} IS NULL
    OR d.to_Customer = {{ ui.ontable.filters.to_Customer }}
  )
  AND (
    {{ ui.ontable.filters.to_Transporter }} IS NULL
    OR d.to_Transporter = {{ ui.ontable.filters.to_Transporter }}
  )
  
  -- DateTime filters
  AND (
  {{ ui.ontable.filters.EarliestAdvertDate ?? "" }} = ''
  OR FORMAT(d.EarliestAdvertDate, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.EarliestAdvertDate ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.EarliestAdvertDate }} = 'empty'
    AND d.EarliestAdvertDate IS NULL
  )
)
AND (
  {{ ui.ontable.filters.ETA_PortOfDischarge ?? "" }} = ''
  OR FORMAT(d.ETA_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ETA_PortOfDischarge ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.ETA_PortOfDischarge }} = 'empty'
    AND d.ETA_PortOfDischarge IS NULL
  )
)
AND (
  {{ ui.ontable.filters.ETA_Terminal_Inland ?? "" }} = ''
  OR FORMAT(d.ETA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ETA_Terminal_Inland ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.ETA_Terminal_Inland }} = 'empty'
    AND d.ETA_Terminal_Inland IS NULL
  )
)
AND (
  {{ ui.ontable.filters.ATA_Terminal_Inland ?? "" }} = ''
  OR FORMAT(d.ATA_Terminal_Inland, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ATA_Terminal_Inland ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.ATA_Terminal_Inland }} = 'empty'
    AND d.ATA_Terminal_Inland IS NULL
  )
)
AND (
  {{ ui.ontable.filters.ETA_DeliveryAddress ?? "" }} = ''
  OR FORMAT(d.ETA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ETA_DeliveryAddress ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.ETA_DeliveryAddress }} = 'empty'
    AND d.ETA_DeliveryAddress IS NULL
  )
)
AND (
  {{ ui.ontable.filters.ATA_DeliveryAddress ?? "" }} = ''
  OR FORMAT(d.ATA_DeliveryAddress, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ATA_DeliveryAddress ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.ATA_DeliveryAddress }} = 'empty'
    AND d.ATA_DeliveryAddress IS NULL
  )
)
AND (
  {{ ui.ontable.filters.FirstTimestamp ?? "" }} = ''
  OR FORMAT(ft.Timestamp, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.FirstTimestamp ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.FirstTimestamp }} = 'empty'
    AND ft.Timestamp IS NULL
  )
)
AND (
  {{ ui.ontable.filters.ATA_DropOff_Terminal ?? "" }} = ''
  OR FORMAT(d.ATA_DropOff_Terminal, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ATA_DropOff_Terminal ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.ATA_DropOff_Terminal }} = 'empty'
    AND d.ATA_DropOff_Terminal IS NULL
  )
)
AND (
  {{ ui.ontable.filters.TransmissionTimestamp ?? "" }} = ''
  OR FORMAT(d.TransmissionTimestamp, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.TransmissionTimestamp ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.TransmissionTimestamp }} = 'empty'
    AND d.TransmissionTimestamp IS NULL
  )
)
AND (
  {{ ui.ontable.filters.ATD_Pickup_PortOfDischarge ?? "" }} = ''
  OR FORMAT(d.ATD_Pickup_PortOfDischarge, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ATD_Pickup_PortOfDischarge ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.ATD_Pickup_PortOfDischarge }} = 'empty'
    AND d.ATD_Pickup_PortOfDischarge IS NULL
  )
)
AND (
  {{ ui.ontable.filters.ATA_Seaport ?? "" }} = ''
  OR FORMAT(d.ATA_Seaport, 'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ATA_Seaport ?? "" }} + '%'
  OR (
    {{ ui.ontable.filters.ATA_Seaport }} = 'empty'
    AND d.ATA_Seaport IS NULL
  )
)

ORDER BY
  d.TransmissionTimestamp DESC
OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;