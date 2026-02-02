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
ORDER BY
   ORDER BY
    /* for to_Customer: ASC and DESC cases */
    CASE WHEN ':param3' = 'to_Customer' 
              AND UPPER(':param4') = 'ASC' THEN d.to_Customer END ASC,
    CASE WHEN ':param5' = 'to_Customer' 
              AND UPPER(':param6') = 'DESC' THEN d.to_Customer END DESC,

    /* for to_Transporter: ASC and DESC cases */
    CASE WHEN ':param7' = 'to_Transporter' 
              AND UPPER(':param8') = 'ASC' THEN d.to_Transporter END ASC,
    CASE WHEN ':param9' = 'to_Transporter' 
              AND UPPER(':param10') = 'DESC' THEN d.to_Transporter END DESC,

    /* for Status_Dispo: ASC and DESC cases */
    CASE WHEN ':param11' = 'Status_Dispo' 
              AND UPPER(':param12') = 'ASC' THEN d.Status_Dispo END ASC,
    CASE WHEN ':param13' = 'Status_Dispo' 
              AND UPPER(':param14') = 'DESC' THEN d.Status_Dispo END DESC,

    /* for Status_Transport: ASC and DESC cases */
    CASE WHEN ':param15' = 'Status_Transport' 
              AND UPPER(':param16') = 'ASC' THEN d.Status_Transport END ASC,
    CASE WHEN ':param17' = 'Status_Transport' 
              AND UPPER(':param18') = 'DESC' THEN d.Status_Transport END DESC,

    /* for Condition: ASC and DESC cases */
    CASE WHEN ':param19' = 'Condition' 
              AND UPPER(':param20') = 'ASC' THEN d.Condition END ASC,
    CASE WHEN ':param21' = 'Condition' 
              AND UPPER(':param22') = 'DESC' THEN d.Condition END DESC,

    /* for MBL_No: ASC and DESC cases */
    CASE WHEN ':param23' = 'MBL_No' 
              AND UPPER(':param24') = 'ASC' THEN tm.Wert END ASC,
    CASE WHEN ':param25' = 'MBL_No' 
              AND UPPER(':param26') = 'DESC' THEN tm.Wert END DESC,

    /* for Container_No: ASC and DESC cases */
    CASE WHEN ':param27' = 'Container_No' 
              AND UPPER(':param28') = 'ASC' THEN tm2.Wert END ASC,
    CASE WHEN ':param29' = 'Container_No' 
              AND UPPER(':param30') = 'DESC' THEN tm2.Wert END DESC,

    /* for TransmissionTimestamp: ASC and DESC cases */
    CASE WHEN ':param31' = 'TransmissionTimestamp' 
              AND UPPER(':param32') = 'ASC' THEN d.TransmissionTimestamp END ASC,
    CASE WHEN ':param33' = 'TransmissionTimestamp' 
              AND UPPER(':param34') = 'DESC' THEN d.TransmissionTimestamp END DESC,

    /* for ContainerSize: ASC and DESC cases */
    CASE WHEN ':param35' = 'ContainerSize' 
              AND UPPER(':param36') = 'ASC' THEN d.ContainerSize END ASC,
    CASE WHEN ':param37' = 'ContainerSize' 
              AND UPPER(':param38') = 'DESC' THEN d.ContainerSize END DESC,

    /* for Carrier: ASC and DESC cases */
    CASE WHEN ':param39' = 'Carrier' 
              AND UPPER(':param40') = 'ASC' THEN d.Carrier END ASC,
    CASE WHEN ':param41' = 'Carrier' 
              AND UPPER(':param42') = 'DESC' THEN d.Carrier END DESC,

    /* for Vessel: ASC and DESC cases */
    CASE WHEN ':param43' = 'Vessel' 
              AND UPPER(':param44') = 'ASC' THEN d.Vessel END ASC,
    CASE WHEN ':param45' = 'Vessel' 
              AND UPPER(':param46') = 'DESC' THEN d.Vessel END DESC,

    /* for AdvertFlag: ASC and DESC cases */
    CASE WHEN ':param47' = 'AdvertFlag' 
              AND UPPER(':param48') = 'ASC' THEN d.AdvertFlag END ASC,
    CASE WHEN ':param49' = 'AdvertFlag' 
              AND UPPER(':param50') = 'DESC' THEN d.AdvertFlag END DESC,

    /* for RealAdvertFlag: ASC and DESC cases */
    CASE WHEN ':param51' = 'RealAdvertFlag' 
              AND UPPER(':param52') = 'ASC' THEN d.RealAdvertFlag END ASC,
    CASE WHEN ':param53' = 'RealAdvertFlag' 
              AND UPPER(':param54') = 'DESC' THEN d.RealAdvertFlag END DESC,

    /* for EarliestAdvertDate: ASC and DESC cases */
    CASE WHEN ':param55' = 'EarliestAdvertDate' 
              AND UPPER(':param56') = 'ASC' THEN d.EarliestAdvertDate END ASC,
    CASE WHEN ':param57' = 'EarliestAdvertDate' 
              AND UPPER(':param58') = 'DESC' THEN d.EarliestAdvertDate END DESC,

    /* for ETA_PortOfDischarge: ASC and DESC cases */
    CASE WHEN ':param59' = 'ETA_PortOfDischarge' 
              AND UPPER(':param60') = 'ASC' THEN d.ETA_PortOfDischarge END ASC,
    CASE WHEN ':param61' = 'ETA_PortOfDischarge' 
              AND UPPER(':param62') = 'DESC' THEN d.ETA_PortOfDischarge END DESC,

    /* for Broker: ASC and DESC cases */
    CASE WHEN ':param63' = 'Broker' 
              AND UPPER(':param64') = 'ASC' THEN d.Broker END ASC,
    CASE WHEN ':param65' = 'Broker' 
              AND UPPER(':param66') = 'DESC' THEN d.Broker END DESC,

    /* for Direct_Truck: ASC and DESC cases */
    CASE WHEN ':param67' = 'Direct_Truck' 
              AND UPPER(':param68') = 'ASC' THEN d.Direct_Truck END ASC,
    CASE WHEN ':param69' = 'Direct_Truck' 
              AND UPPER(':param70') = 'DESC' THEN d.Direct_Truck END DESC,

    /* for ATA_Seaport: ASC and DESC cases */
    CASE WHEN ':param71' = 'ATA_Seaport' 
              AND UPPER(':param72') = 'ASC' THEN d.ATA_Seaport END ASC,
    CASE WHEN ':param73' = 'ATA_Seaport' 
              AND UPPER(':param74') = 'DESC' THEN d.ATA_Seaport END DESC,

    /* for PortOfDischarge_UNLOCO: ASC and DESC cases */
    CASE WHEN ':param75' = 'PortOfDischarge_UNLOCO' 
              AND UPPER(':param76') = 'ASC' THEN d.PortOfDischarge_UNLOCO END ASC,
    CASE WHEN ':param77' = 'PortOfDischarge_UNLOCO' 
              AND UPPER(':param78') = 'DESC' THEN d.PortOfDischarge_UNLOCO END DESC,

    /* for Terminal_PortOfDischarge: ASC and DESC cases */
    CASE WHEN ':param79' = 'Terminal_PortOfDischarge' 
              AND UPPER(':param80') = 'ASC' THEN d.Terminal_PortOfDischarge END ASC,
    CASE WHEN ':param81' = 'Terminal_PortOfDischarge' 
              AND UPPER(':param82') = 'DESC' THEN d.Terminal_PortOfDischarge END DESC,

    /* for Pincode: ASC and DESC cases */
    CASE WHEN ':param83' = 'Pincode' 
              AND UPPER(':param84') = 'ASC' THEN d.Pincode END ASC,
    CASE WHEN ':param85' = 'Pincode' 
              AND UPPER(':param86') = 'DESC' THEN d.Pincode END DESC,

    /* for ATD_Pickup_PortOfDischarge: ASC and DESC cases */
    CASE WHEN ':param87' = 'ATD_Pickup_PortOfDischarge' 
              AND UPPER(':param88') = 'ASC' THEN d.ATD_Pickup_PortOfDischarge END ASC,
    CASE WHEN ':param89' = 'ATD_Pickup_PortOfDischarge' 
              AND UPPER(':param90') = 'DESC' THEN d.ATD_Pickup_PortOfDischarge END DESC,

    /* for ETA_Terminal_Inland: ASC and DESC cases */
    CASE WHEN ':param91' = 'ETA_Terminal_Inland' 
              AND UPPER(':param92') = 'ASC' THEN d.ETA_Terminal_Inland END ASC,
    CASE WHEN ':param93' = 'ETA_Terminal_Inland' 
              AND UPPER(':param94') = 'DESC' THEN d.ETA_Terminal_Inland END DESC,

    /* for ATA_Terminal_Inland: ASC and DESC cases */
    CASE WHEN ':param95' = 'ATA_Terminal_Inland' 
              AND UPPER(':param96') = 'ASC' THEN d.ATA_Terminal_Inland END ASC,
    CASE WHEN ':param97' = 'ATA_Terminal_Inland' 
              AND UPPER(':param98') = 'DESC' THEN d.ATA_Terminal_Inland END DESC,

    /* for ETA_DeliveryAddress: ASC and DESC cases */
    CASE WHEN ':param99' = 'ETA_DeliveryAddress' 
              AND UPPER(':param100') = 'ASC' THEN d.ETA_DeliveryAddress END ASC,
    CASE WHEN ':param101' = 'ETA_DeliveryAddress' 
              AND UPPER(':param102') = 'DESC' THEN d.ETA_DeliveryAddress END DESC,

    /* for ATA_DeliveryAddress: ASC and DESC cases */
    CASE WHEN ':param103' = 'ATA_DeliveryAddress' 
              AND UPPER(':param104') = 'ASC' THEN d.ATA_DeliveryAddress END ASC,
    CASE WHEN ':param105' = 'ATA_DeliveryAddress' 
              AND UPPER(':param106') = 'DESC' THEN d.ATA_DeliveryAddress END DESC,

    /* for Terminal_Inland_Vorgabe_NTL: ASC and DESC cases */
    CASE WHEN ':param107' = 'Terminal_Inland_Vorgabe_NTL' 
              AND UPPER(':param108') = 'ASC' THEN d.Terminal_Inland_Vorgabe_NTL END ASC,
    CASE WHEN ':param109' = 'Terminal_Inland_Vorgabe_NTL' 
              AND UPPER(':param110') = 'DESC' THEN d.Terminal_Inland_Vorgabe_NTL END DESC,

    /* for DeliveryAddress: ASC and DESC cases */
    CASE WHEN ':param111' = 'DeliveryAddress' 
              AND UPPER(':param112') = 'ASC' THEN d.DeliveryAddress END ASC,
    CASE WHEN ':param113' = 'DeliveryAddress' 
              AND UPPER(':param114') = 'DESC' THEN d.DeliveryAddress END DESC,

    /* for DropOff_Terminal: ASC and DESC cases */
    CASE WHEN ':param115' = 'DropOff_Terminal' 
              AND UPPER(':param116') = 'ASC' THEN d.DropOff_Terminal END ASC,
    CASE WHEN ':param117' = 'DropOff_Terminal' 
              AND UPPER(':param118') = 'DESC' THEN d.DropOff_Terminal END DESC,

    /* for DropOff_Terminal_TIR: ASC and DESC cases */
    CASE WHEN ':param119' = 'DropOff_Terminal_TIR' 
              AND UPPER(':param120') = 'ASC' THEN d.DropOff_Terminal_TIR END ASC,
    CASE WHEN ':param121' = 'DropOff_Terminal_TIR' 
              AND UPPER(':param122') = 'DESC' THEN d.DropOff_Terminal_TIR END DESC,

    /* for ATA_DropOff_Terminal: ASC and DESC cases */
    CASE WHEN ':param123' = 'ATA_DropOff_Terminal' 
              AND UPPER(':param124') = 'ASC' THEN d.ATA_DropOff_Terminal END ASC,
    CASE WHEN ':param125' = 'ATA_DropOff_Terminal' 
              AND UPPER(':param126') = 'DESC' THEN d.ATA_DropOff_Terminal END DESC,

    /* for Transport_Mode_final_DeliveryAddress: ASC and DESC cases */
    CASE WHEN ':param127' = 'Transport_Mode_final_DeliveryAddress' 
              AND UPPER(':param128') = 'ASC' THEN d.Transport_Mode_final_DeliveryAddress END ASC,
    CASE WHEN ':param129' = 'Transport_Mode_final_DeliveryAddress' 
              AND UPPER(':param130') = 'DESC' THEN d.Transport_Mode_final_DeliveryAddress END DESC,

    /* for Transport_Mode_Terminal: ASC and DESC cases */
    CASE WHEN ':param131' = 'Transport_Mode_Terminal' 
              AND UPPER(':param132') = 'ASC' THEN d.Transport_Mode_Terminal END ASC,
    CASE WHEN ':param133' = 'Transport_Mode_Terminal' 
              AND UPPER(':param134') = 'DESC' THEN d.Transport_Mode_Terminal END DESC,

    /* for Terminal_Inland_CundA: ASC and DESC cases */
    CASE WHEN ':param135' = 'Terminal_Inland_CundA' 
              AND UPPER(':param136') = 'ASC' THEN d.Terminal_Inland_CundA END ASC,
    CASE WHEN ':param137' = 'Terminal_Inland_CundA' 
              AND UPPER(':param138') = 'DESC' THEN d.Terminal_Inland_CundA END DESC,

    /* for Terminal_Inland_CTV: ASC and DESC cases */
    CASE WHEN ':param139' = 'Terminal_Inland_CTV' 
              AND UPPER(':param140') = 'ASC' THEN d.Terminal_Inland_CTV END ASC,
    CASE WHEN ':param141' = 'Terminal_Inland_CTV' 
              AND UPPER(':param142') = 'DESC' THEN d.Terminal_Inland_CTV END DESC,

    /* for CustomerID: ASC and DESC cases */
    CASE WHEN ':param143' = 'CustomerID' 
              AND UPPER(':param144') = 'ASC' THEN d.CustomerID END ASC,
    CASE WHEN ':param145' = 'CustomerID' 
              AND UPPER(':param146') = 'DESC' THEN d.CustomerID END DESC,

    /* for MBL_ID: ASC and DESC cases */
    CASE WHEN ':param147' = 'MBL_ID' 
              AND UPPER(':param148') = 'ASC' THEN d.MBL_ID END ASC,
    CASE WHEN ':param149' = 'MBL_ID' 
              AND UPPER(':param150') = 'DESC' THEN d.MBL_ID END DESC,

    /* for transport_Dispo_ID: ASC and DESC cases */
    CASE WHEN ':param151' = 'transport_Dispo_ID' 
              AND UPPER(':param152') = 'ASC' THEN d.transport_Dispo_ID END ASC,
    CASE WHEN ':param153' = 'transport_Dispo_ID' 
              AND UPPER(':param154') = 'DESC' THEN d.transport_Dispo_ID END DESC,

    /* for ContainerID: ASC and DESC cases */
    CASE WHEN ':param155' = 'ContainerID' 
              AND UPPER(':param156') = 'ASC' THEN d.ContainerID END ASC,
    CASE WHEN ':param157' = 'ContainerID' 
              AND UPPER(':param158') = 'DESC' THEN d.ContainerID END DESC,

    /* for FirstTimestamp: ASC and DESC cases */
    CASE WHEN ':param159' = 'FirstTimestamp' 
              AND UPPER(':param160') = 'ASC' THEN ft.Timestamp END ASC,
    CASE WHEN ':param161' = 'FirstTimestamp' 
              AND UPPER(':param162') = 'DESC' THEN ft.Timestamp END DESC,

    /* fallback default when nothing matched */
    d.TransmissionTimestamp DESC

OFFSET @Offset ROWS FETCH NEXT @PageSize
    /* fallback default when nothing matched */
    d.TransmissionTimestamp DESC

OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
