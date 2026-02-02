--DECLARE @CustomerID NVARCHAR(50) = :param0;
--DECLARE @MBL_ID NVARCHAR(50) = :param1;
--DECLARE @ContainerID NVARCHAR(50) = :param2;


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
    msg.Customer_ID =:param3
    AND msg.MBL_ID =:param4
    AND msg.Container_ID = :param5;
