SELECT 
    d.*,
    tm.Wert AS MBL_No,
    tm2.Wert AS Container_No,
    (
        SELECT COUNT(*)
        FROM transport_messages msg
        WHERE msg.Transport_Dispo_ID = d.Transport_Dispo_ID
    ) AS error_count
FROM dbo.transport_UI AS d
JOIN dbo.Transport_Mapping tm
    ON tm.Schluessel = d.MBL_ID AND tm.Typ = 'M'
JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID AND tm2.Typ = 'C'
WHERE
    (d.Status LIKE '%' + {{ ui.ontable5.filters.Status ?? "" }} + '%' OR {{ ui.ontable5.filters.Status ?? "" }} = '')
    AND (d.TransmissionTimestamp LIKE '%' + {{ ui.ontable5.filters.TransmissionTimestamp ?? "" }} + '%' OR {{ ui.ontable5.filters.TransmissionTimestamp ?? "" }} = '')
    AND (d.Voyage LIKE '%' + {{ ui.ontable5.filters.Voyage ?? "" }} + '%' OR {{ ui.ontable5.filters.Voyage ?? "" }} = '')
    AND (d.ContainerSize LIKE '%' + {{ ui.ontable5.filters.ContainerSize ?? "" }} + '%' OR {{ ui.ontable5.filters.ContainerSize ?? "" }} = '')
    AND (d.Broker LIKE '%' + {{ ui.ontable5.filters.Broker ?? "" }} + '%' OR {{ ui.ontable5.filters.Broker ?? "" }} = '')
    AND (d.Carrier LIKE '%' + {{ ui.ontable5.filters.Carrier ?? "" }} + '%' OR {{ ui.ontable5.filters.Carrier ?? "" }} = '')
    AND (d.Vessel LIKE '%' + {{ ui.ontable5.filters.Vessel ?? "" }} + '%' OR {{ ui.ontable5.filters.Vessel ?? "" }} = '')
    AND (d.PortOfDischarge_Lima LIKE '%' + {{ ui.ontable5.filters.PortOfDischarge_Lima ?? "" }} + '%' OR {{ ui.ontable5.filters.PortOfDischarge_Lima ?? "" }} = '')
    AND (d.ETA_PortOfDischarge LIKE '%' + {{ ui.ontable5.filters.ETA_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable5.filters.ETA_PortOfDischarge ?? "" }} = '')
    AND (d.PackingMethod LIKE '%' + {{ ui.ontable5.filters.PackingMethod ?? "" }} + '%' OR {{ ui.ontable5.filters.PackingMethod ?? "" }} = '')
    AND (d.TotalWeight LIKE '%' + {{ ui.ontable5.filters.TotalWeight ?? "" }} + '%' OR {{ ui.ontable5.filters.TotalWeight ?? "" }} = '')
    AND (d.AdvertFlag LIKE '%' + {{ ui.ontable5.filters.AdvertFlag ?? "" }} + '%' OR {{ ui.ontable5.filters.AdvertFlag ?? "" }} = '')
    AND (d.RealAdvertFlag LIKE '%' + {{ ui.ontable5.filters.RealAdvertFlag ?? "" }} + '%' OR {{ ui.ontable5.filters.RealAdvertFlag ?? "" }} = '')
    AND (d.ETA_Delivery_Address_Update_TimeStamp LIKE '%' + {{ ui.ontable5.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} + '%' OR {{ ui.ontable5.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} = '')
ORDER BY 
    CASE {{ ui.ontable5.sortColumn ?? "MBL_No" }}
        WHEN 'MBL_No' THEN tm.Wert
        WHEN 'Container_No' THEN tm2.Wert
        WHEN 'Status' THEN d.Status
        WHEN 'TransmissionTimestamp' THEN d.TransmissionTimestamp
        WHEN 'Voyage' THEN d.Voyage
        WHEN 'ContainerSize' THEN d.ContainerSize
        WHEN 'Broker' THEN d.Broker
        WHEN 'Carrier' THEN d.Carrier
        WHEN 'Vessel' THEN d.Vessel
        WHEN 'PortOfDischarge_Lima' THEN d.PortOfDischarge_Lima
        WHEN 'ETA_PortOfDischarge' THEN d.ETA_PortOfDischarge
        WHEN 'PackingMethod' THEN d.PackingMethod
        WHEN 'TotalWeight' THEN d.TotalWeight
        WHEN 'AdvertFlag' THEN d.AdvertFlag
        WHEN 'ETA_Delivery_Address_Update_TimeStamp' THEN ETA_Delivery_Address_Update_TimeStamp
    
    END {{ ui.ontable5.sortDirection ?? 'ASC' }}
OFFSET {{ ui.ontable5.paginationOffset }} ROWS
FETCH NEXT {{ ui.ontable5.pageSize }} ROWS ONLY;