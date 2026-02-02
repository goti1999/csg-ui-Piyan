SELECT 
    msg.Customer_ID,
    msg.MBL_ID,
    msg.Container_ID,
    msg.Message_Code,
    msg.Text,
    msg.Type,
    msg.transport_Message_ID,
    msg.Transport_Dispo_ID
FROM dbo.Transport_Messages msg
WHERE msg.Customer_ID = :param0
  AND msg.MBL_ID = :param1
  AND msg.Container_ID = :param2;
