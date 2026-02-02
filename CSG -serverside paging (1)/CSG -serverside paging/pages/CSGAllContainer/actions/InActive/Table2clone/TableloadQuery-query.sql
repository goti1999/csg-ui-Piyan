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
    AND ({{ ui.ontable.filters.Status_Transport ?? "" }} = '' OR d.Status_Transport LIKE '%' + {{ ui.ontable.filters.Status_Transport }} + '%')
    AND ({{ ui.ontable.filters.MBL_No ?? "" }} = '' OR tm.Wert LIKE '%' + {{ ui.ontable.filters.MBL_No }} + '%')
    AND ({{ ui.ontable.filters.Container_No ?? "" }} = '' OR tm2.Wert LIKE '%' + {{ ui.ontable.filters.Container_No }} + '%')
    AND ({{ ui.ontable.filters.Carrier ?? "" }} = '' OR d.Carrier LIKE '%' + {{ ui.ontable.filters.Carrier }} + '%')
    AND ({{ ui.ontable.filters.Vessel ?? "" }} = '' OR d.Vessel LIKE '%' + {{ ui.ontable.filters.Vessel }} + '%')
    AND ({{ ui.ontable.filters.ContainerSize ?? "" }} = '' OR d.ContainerSize LIKE '%' + {{ ui.ontable.filters.ContainerSize }} + '%')
    AND ({{ ui.ontable.filters.Broker ?? "" }} = '' OR d.Broker LIKE '%' + {{ ui.ontable.filters.Broker }} + '%')
    AND ({{ ui.ontable.filters.Voyage ?? "" }} = '' OR d.Voyage LIKE '%' + {{ ui.ontable.filters.Voyage }} + '%')
    AND ({{ ui.ontable.filters.PackingMethod ?? "" }} = '' OR d.PackingMethod LIKE '%' + {{ ui.ontable.filters.PackingMethod }} + '%')
    AND ({{ ui.ontable.filters.TotalWeight ?? "" }} = '' OR d.TotalWeight LIKE '%' + {{ ui.ontable.filters.TotalWeight }} + '%')
    AND ({{ ui.ontable.filters.AdvertFlag ?? "" }} = '' OR d.AdvertFlag LIKE '%' + {{ ui.ontable.filters.AdvertFlag }} + '%')
    AND ({{ ui.ontable.filters.RealAdvertFlag ?? "" }} = '' OR d.RealAdvertFlag LIKE '%' + {{ ui.ontable.filters.RealAdvertFlag }} + '%')
    AND ({{ ui.ontable.filters.EarliestAdvertDate ?? "" }} = '' OR FORMAT(d.EarliestAdvertDate,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.EarliestAdvertDate }} + '%')
    AND ({{ ui.ontable.filters.ETA_PortOfDischarge ?? "" }} = '' OR FORMAT(d.ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ETA_PortOfDischarge }} + '%')
    AND ({{ ui.ontable.filters.ETA_Terminal_Inland ?? "" }} = '' OR FORMAT(d.ETA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ETA_Terminal_Inland }} + '%')
    AND ({{ ui.ontable.filters.ATA_Terminal_Inland ?? "" }} = '' OR FORMAT(d.ATA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ATA_Terminal_Inland }} + '%')
    AND ({{ ui.ontable.filters.ETA_DeliveryAddress ?? "" }} = '' OR FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ETA_DeliveryAddress }} + '%')
    AND ({{ ui.ontable.filters.ATA_DeliveryAddress ?? "" }} = '' OR FORMAT(d.ATA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.ATA_DeliveryAddress }} + '%')
    AND ({{ ui.ontable.filters.to_Customer ?? "" }} = '' OR d.to_Customer LIKE '%' + {{ ui.ontable.filters.to_Customer }} + '%')
    AND ({{ ui.ontable.filters.to_Transporter ?? "" }} = '' OR d.to_Transporter LIKE '%' + {{ ui.ontable.filters.to_Transporter }} + '%')
    AND ({{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress ?? "" }} = '' OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + {{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress }} + '%')
    AND ({{ ui.ontable.filters.Transport_Mode_Terminal ?? "" }} = '' OR d.Transport_Mode_Terminal LIKE '%' + {{ ui.ontable.filters.Transport_Mode_Terminal }} + '%')
    AND ({{ ui.ontable.filters.Terminal_Inland_CundA ?? "" }} = '' OR d.Terminal_Inland_CundA LIKE '%' + {{ ui.ontable.filters.Terminal_Inland_CundA }} + '%')
    AND ({{ ui.ontable.filters.Terminal_Inland_CTV ?? "" }} = '' OR d.Terminal_Inland_CTV LIKE '%' + {{ ui.ontable.filters.Terminal_Inland_CTV }} + '%')
    AND ({{ ui.ontable.filters.DropOff_Terminal ?? "" }} = '' OR d.DropOff_Terminal LIKE '%' + {{ ui.ontable.filters.DropOff_Terminal }} + '%')
    AND ({{ ui.ontable.filters.ATA_DropOff_Terminal ?? "" }} = '' OR d.ATA_DropOff_Terminal LIKE '%' + {{ ui.ontable.filters.ATA_DropOff_Terminal }} + '%')
    AND ({{ ui.ontable.filters.Pincode ?? "" }} = '' OR d.Pincode LIKE '%' + {{ ui.ontable.filters.Pincode }} + '%')
    AND ({{ ui.ontable.filters.Condition ?? "" }} = '' OR d.Condition LIKE '%' + {{ ui.ontable.filters.Condition }} + '%')
    AND ({{ ui.ontable.filters.terminal_portofdischarge ?? "" }} = '' OR d.Terminal_PortOfDischarge LIKE '%' + {{ ui.ontable.filters.terminal_portofdischarge }} + '%')
    AND ({{ ui.ontable.filters.Status_Dispo ?? "" }} = '' OR d.Status_Dispo LIKE '%' + {{ ui.ontable.filters.Status_Dispo }} + '%')
    AND ({{ ui.ontable.filters.CustomerID ?? "" }} = '' OR d.CustomerID LIKE '%' + {{ ui.ontable.filters.CustomerID }} + '%')
    AND ({{ ui.ontable.filters.MBL_ID ?? "" }} = '' OR d.MBL_ID LIKE '%' + {{ ui.ontable.filters.MBL_ID }} + '%')
    AND ({{ ui.ontable.filters.transport_Dispo_ID ?? "" }} = '' OR d.transport_Dispo_ID LIKE '%' + {{ ui.ontable.filters.transport_Dispo_ID }} + '%')
    AND ({{ ui.ontable.filters.ContainerID ?? "" }} = '' OR d.ContainerID LIKE '%' + {{ ui.ontable.filters.ContainerID }} + '%')
    AND ({{ ui.ontable.filters.ATA_Seaport ?? "" }} = '' OR d.ATA_Seaport LIKE '%' + {{ ui.ontable.filters.ATA_Seaport }} + '%')
    AND ({{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL ?? "" }} = '' OR d.Terminal_Inland_Vorgabe_NTL LIKE '%' + {{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL }} + '%')
    AND ({{ ui.ontable.filters.DropOff_Terminal_TIR ?? "" }} = '' OR d.DropOff_Terminal_TIR LIKE '%' + {{ ui.ontable.filters.DropOff_Terminal_TIR }} + '%')
    AND ({{ ui.ontable.filters.FirstTimestamp ?? "" }} = '' OR FORMAT(ft.Timestamp,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable.filters.FirstTimestamp }} + '%')


ORDER BY d.TransmissionTimestamp DESC

OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
