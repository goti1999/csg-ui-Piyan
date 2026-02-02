DECLARE @PageNumber INT = {{ui.ontable5.paginationOffset}} / {{ui.ontable5.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable5.pageSize}};
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
ORDER BY
   ORDER BY
    /* for to_Customer: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'to_Customer' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.to_Customer END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'to_Customer' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.to_Customer END DESC,

    /* for to_Transporter: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'to_Transporter' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.to_Transporter END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'to_Transporter' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.to_Transporter END DESC,

    /* for Status_Dispo: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Status_Dispo' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Status_Dispo END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Status_Dispo' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Status_Dispo END DESC,

    /* for Status_Transport: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Status_Transport' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Status_Transport END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Status_Transport' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Status_Transport END DESC,

    /* for Condition: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Condition' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Condition END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Condition' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Condition END DESC,

    /* for MBL_No: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'MBL_No' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN tm.Wert END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'MBL_No' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN tm.Wert END DESC,

    /* for Container_No: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Container_No' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN tm2.Wert END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Container_No' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN tm2.Wert END DESC,

    /* for TransmissionTimestamp: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'TransmissionTimestamp' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.TransmissionTimestamp END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'TransmissionTimestamp' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.TransmissionTimestamp END DESC,

    /* for ContainerSize: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ContainerSize' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ContainerSize END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ContainerSize' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ContainerSize END DESC,

    /* for Carrier: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Carrier' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Carrier END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Carrier' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Carrier END DESC,

    /* for Vessel: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Vessel' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Vessel END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Vessel' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Vessel END DESC,

    /* for AdvertFlag: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'AdvertFlag' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.AdvertFlag END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'AdvertFlag' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.AdvertFlag END DESC,

    /* for RealAdvertFlag: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'RealAdvertFlag' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.RealAdvertFlag END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'RealAdvertFlag' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.RealAdvertFlag END DESC,

    /* for EarliestAdvertDate: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'EarliestAdvertDate' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.EarliestAdvertDate END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'EarliestAdvertDate' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.EarliestAdvertDate END DESC,

    /* for ETA_PortOfDischarge: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ETA_PortOfDischarge' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ETA_PortOfDischarge END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ETA_PortOfDischarge' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ETA_PortOfDischarge END DESC,

    /* for Broker: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Broker' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Broker END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Broker' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Broker END DESC,

    /* for Direct_Truck: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Direct_Truck' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Direct_Truck END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Direct_Truck' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Direct_Truck END DESC,

    /* for ATA_Seaport: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATA_Seaport' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ATA_Seaport END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATA_Seaport' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ATA_Seaport END DESC,

    /* for PortOfDischarge_UNLOCO: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'PortOfDischarge_UNLOCO' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.PortOfDischarge_UNLOCO END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'PortOfDischarge_UNLOCO' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.PortOfDischarge_UNLOCO END DESC,

    /* for Terminal_PortOfDischarge: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Terminal_PortOfDischarge' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Terminal_PortOfDischarge END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Terminal_PortOfDischarge' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Terminal_PortOfDischarge END DESC,

    /* for Pincode: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Pincode' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Pincode END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Pincode' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Pincode END DESC,

    /* for ATD_Pickup_PortOfDischarge: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATD_Pickup_PortOfDischarge' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ATD_Pickup_PortOfDischarge END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATD_Pickup_PortOfDischarge' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ATD_Pickup_PortOfDischarge END DESC,

    /* for ETA_Terminal_Inland: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ETA_Terminal_Inland' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ETA_Terminal_Inland END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ETA_Terminal_Inland' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ETA_Terminal_Inland END DESC,

    /* for ATA_Terminal_Inland: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATA_Terminal_Inland' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ATA_Terminal_Inland END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATA_Terminal_Inland' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ATA_Terminal_Inland END DESC,

    /* for ETA_DeliveryAddress: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ETA_DeliveryAddress' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ETA_DeliveryAddress END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ETA_DeliveryAddress' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ETA_DeliveryAddress END DESC,

    /* for ATA_DeliveryAddress: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATA_DeliveryAddress' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ATA_DeliveryAddress END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATA_DeliveryAddress' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ATA_DeliveryAddress END DESC,

    /* for Terminal_Inland_Vorgabe_NTL: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Terminal_Inland_Vorgabe_NTL' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Terminal_Inland_Vorgabe_NTL END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Terminal_Inland_Vorgabe_NTL' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Terminal_Inland_Vorgabe_NTL END DESC,

    /* for DeliveryAddress: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'DeliveryAddress' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.DeliveryAddress END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'DeliveryAddress' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.DeliveryAddress END DESC,

    /* for DropOff_Terminal: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'DropOff_Terminal' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.DropOff_Terminal END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'DropOff_Terminal' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.DropOff_Terminal END DESC,

    /* for DropOff_Terminal_TIR: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'DropOff_Terminal_TIR' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.DropOff_Terminal_TIR END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'DropOff_Terminal_TIR' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.DropOff_Terminal_TIR END DESC,

    /* for ATA_DropOff_Terminal: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATA_DropOff_Terminal' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ATA_DropOff_Terminal END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ATA_DropOff_Terminal' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ATA_DropOff_Terminal END DESC,

    /* for Transport_Mode_final_DeliveryAddress: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Transport_Mode_final_DeliveryAddress' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Transport_Mode_final_DeliveryAddress END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Transport_Mode_final_DeliveryAddress' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Transport_Mode_final_DeliveryAddress END DESC,

    /* for Transport_Mode_Terminal: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Transport_Mode_Terminal' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Transport_Mode_Terminal END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Transport_Mode_Terminal' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Transport_Mode_Terminal END DESC,

    /* for Terminal_Inland_CundA: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Terminal_Inland_CundA' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Terminal_Inland_CundA END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Terminal_Inland_CundA' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Terminal_Inland_CundA END DESC,

    /* for Terminal_Inland_CTV: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Terminal_Inland_CTV' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.Terminal_Inland_CTV END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'Terminal_Inland_CTV' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.Terminal_Inland_CTV END DESC,

    /* for CustomerID: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'CustomerID' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.CustomerID END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'CustomerID' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.CustomerID END DESC,

    /* for MBL_ID: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'MBL_ID' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.MBL_ID END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'MBL_ID' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.MBL_ID END DESC,

    /* for transport_Dispo_ID: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'transport_Dispo_ID' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.transport_Dispo_ID END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'transport_Dispo_ID' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.transport_Dispo_ID END DESC,

    /* for ContainerID: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ContainerID' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN d.ContainerID END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'ContainerID' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN d.ContainerID END DESC,

    /* for FirstTimestamp: ASC and DESC cases */
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'FirstTimestamp' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'ASC' THEN ft.Timestamp END ASC,
    CASE WHEN '{{ ui.ontable5.sortColumn ?? '' }}' = 'FirstTimestamp' 
              AND UPPER('{{ ui.ontable5.sortDirection ?? 'DESC' }}') = 'DESC' THEN ft.Timestamp END DESC,

    /* fallback default when nothing matched */
    d.TransmissionTimestamp DESC

OFFSET @Offset ROWS FETCH NEXT @PageSize
    /* fallback default when nothing matched */
    d.TransmissionTimestamp DESC

OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
