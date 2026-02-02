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
    ON tm.Schluessel = d.MBL_ID
    AND tm.Typ = 'M'
JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID
    AND tm2.Typ = 'C'
WHERE 
    (d.Delivered = 0 OR d.Delivered IS NULL)
    AND NOT (
        d.Status_Transport = 'transportAssignmentCancellation'
        AND d.Status_Dispo IS NULL
    )
    AND d.CustomerID = {{state.RowCustomerID}}
    AND d.MBL_ID = {{state.RowMBL_ID}}
    AND d.ContainerID = {{state.RowContainerID}}
