SELECT 
    d.*, 
    tm.Wert AS MBL_No, 
    tm2.Wert AS Container_No,
    msg_json.messages
FROM dbo.Transport_Dispo d
JOIN dbo.Transport_Mapping tm 
    ON tm.Schluessel = d.MBL_ID AND tm.Typ = 'M'
JOIN dbo.Transport_Mapping tm2 
    ON tm2.Schluessel = d.ContainerID AND tm2.Typ = 'C'
OUTER APPLY (
    SELECT 
        msg.Customer_ID,
        msg.Message_Code,
        msg.Text,
        msg.Type,
        msg.transport_Message_ID,
        msg.Transport_Dispo_ID
    FROM dbo.Transport_Messages msg
    WHERE msg.MBL_ID = d.MBL_ID
    FOR JSON PATH
) AS msg_json(messages)
    WHERE Status =
?
