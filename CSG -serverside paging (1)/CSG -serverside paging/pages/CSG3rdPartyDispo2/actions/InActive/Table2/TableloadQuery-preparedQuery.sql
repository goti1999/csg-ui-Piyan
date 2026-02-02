DECLARE @PageNumber INT = ? / ? + 1;
DECLARE @PageSize INT = ?;
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
    AND NOT (d.Status_Transport = 'transportAssignmentCancellation'
             AND d.Status_Dispo IS NULL)

    -- 🔽 dynamic filters
    AND (? = '' OR d.Status_Transport LIKE '%' + ? + '%')
    AND (? = '' OR tm.Wert LIKE '%' + ? + '%')
    AND (? = '' OR tm2.Wert LIKE '%' + ? + '%')
    AND (? = '' OR d.Carrier LIKE '%' + ? + '%')
    AND (? = '' OR d.Vessel LIKE '%' + ? + '%')
    AND (? = '' OR d.ContainerSize LIKE '%' + ? + '%')
    AND (? = '' OR d.Broker LIKE '%' + ? + '%')
    AND (? = '' OR d.Voyage LIKE '%' + ? + '%')
    AND (? = '' OR d.PackingMethod LIKE '%' + ? + '%')
    AND (? = '' OR d.TotalWeight LIKE '%' + ? + '%')
    AND (? = '' OR d.AdvertFlag LIKE '%' + ? + '%')
    AND (? = '' OR d.RealAdvertFlag LIKE '%' + ? + '%')
    AND (? = '' OR FORMAT(d.EarliestAdvertDate,'dd-MM-yyyy') LIKE '%' + ? + '%')
    AND (? = '' OR FORMAT(d.ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + ? + '%')
    AND (? = '' OR FORMAT(d.ETA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + ? + '%')
    AND (? = '' OR FORMAT(d.ATA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + ? + '%')
    AND (? = '' OR FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + ? + '%')
    AND (? = '' OR FORMAT(d.ATA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + ? + '%')
    AND (? = '' OR d.to_Customer LIKE '%' + ? + '%')
    AND (? = '' OR d.to_Transporter LIKE '%' + ? + '%')
    AND (? = '' OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + ? + '%')
    AND (? = '' OR d.Transport_Mode_Terminal LIKE '%' + ? + '%')
    AND (? = '' OR d.Terminal_Inland_CundA LIKE '%' + ? + '%')
    AND (? = '' OR d.Terminal_Inland_CTV LIKE '%' + ? + '%')
    AND (? = '' OR d.DropOff_Terminal LIKE '%' + ? + '%')
    AND (? = '' OR d.ATA_DropOff_Terminal LIKE '%' + ? + '%')
    AND (? = '' OR d.Pincode LIKE '%' + ? + '%')
    AND (? = '' OR d.Condition LIKE '%' + ? + '%')
    AND (? = '' OR d.Terminal_PortOfDischarge LIKE '%' + ? + '%')
    AND (? = '' OR d.Status_Dispo LIKE '%' + ? + '%')
    AND (? = '' OR d.CustomerID LIKE '%' + ? + '%')
    AND (? = '' OR d.MBL_ID LIKE '%' + ? + '%')
    AND (? = '' OR d.transport_Dispo_ID LIKE '%' + ? + '%')
    AND (? = '' OR d.ContainerID LIKE '%' + ? + '%')
    AND (? = '' OR d.ATA_Seaport LIKE '%' + ? + '%')
    AND (? = '' OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + ? + '%')
    AND (? = '' OR d.DropOff_Terminal_TIR LIKE '%' + ? + '%')
    AND (? = '' OR FORMAT(ft.Timestamp,'dd-MM-yyyy') LIKE '%' + ? + '%')


ORDER BY d.TransmissionTimestamp DESC

OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
