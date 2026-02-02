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
WHERE msg.Customer_ID = {{ ui.ontable10.clickedRow.data.CustomerID }}
  AND msg.MBL_ID = {{ ui.ontable10.clickedRow.data.MBL_ID }}
  AND msg.Container_ID = {{ ui.ontable10.clickedRow.data.ContainerID }};
