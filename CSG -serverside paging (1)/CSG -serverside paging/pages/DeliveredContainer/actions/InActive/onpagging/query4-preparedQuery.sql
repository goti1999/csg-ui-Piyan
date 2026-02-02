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
    (d.Status LIKE '%' + ? + '%' OR ? = '')
    AND (d.TransmissionTimestamp LIKE '%' + ? + '%' OR ? = '')
    AND (d.Voyage LIKE '%' + ? + '%' OR ? = '')
    AND (d.ContainerSize LIKE '%' + ? + '%' OR ? = '')
    AND (d.Broker LIKE '%' + ? + '%' OR ? = '')
    AND (d.Carrier LIKE '%' + ? + '%' OR ? = '')
    AND (d.Vessel LIKE '%' + ? + '%' OR ? = '')
    AND (d.PortOfDischarge_Lima LIKE '%' + ? + '%' OR ? = '')
    AND (d.ETA_PortOfDischarge LIKE '%' + ? + '%' OR ? = '')
    AND (d.PackingMethod LIKE '%' + ? + '%' OR ? = '')
    AND (d.TotalWeight LIKE '%' + ? + '%' OR ? = '')
    AND (d.AdvertFlag LIKE '%' + ? + '%' OR ? = '')
    AND (d.RealAdvertFlag LIKE '%' + ? + '%' OR ? = '')
    AND (d.ETA_Delivery_Address_Update_TimeStamp LIKE '%' + ? + '%' OR ? = '')
ORDER BY 
    CASE ?
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
    
    END ?
OFFSET ? ROWS
FETCH NEXT ? ROWS ONLY;