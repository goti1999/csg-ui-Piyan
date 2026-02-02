--DECLARE @CustomerID NVARCHAR(50) = {{ steps.code.data.CustomerID }};
--DECLARE @MBL_ID NVARCHAR(50) = {{ steps.code.data.MBL_ID }};
--DECLARE @ContainerID NVARCHAR(50) = {{ steps.code.data.ContainerID }};


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
WHERE 
    msg.Customer_ID ={{ steps.code.data.CustomerID }}
    AND msg.MBL_ID ={{ steps.code.data.MBL_ID }}
    AND msg.Container_ID = {{ steps.code.data.ContainerID }};
