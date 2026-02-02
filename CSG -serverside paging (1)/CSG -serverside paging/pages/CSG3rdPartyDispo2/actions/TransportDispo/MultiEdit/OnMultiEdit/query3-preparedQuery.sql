-- Decode Base64 back to JSON
DECLARE @Base64Data NVARCHAR(MAX) = '?';
DECLARE @JsonData NVARCHAR(MAX) = CAST('' AS XML).value('xs:base64Binary(xs:string(sql:variable("@Base64Data")))', 'VARBINARY(MAX)');
SET @JsonData = CONVERT(NVARCHAR(MAX), @JsonData);

DECLARE @Pincode NVARCHAR(50) = ?;
DECLARE @DropOff_Terminal NVARCHAR(50) = ?;
DECLARE @DropOff_Terminal_TIR NVARCHAR(50) =  ?;
DECLARE @ETA_DeliveryAddress DATETIME = ?;
DECLARE @ATA_Terminal_Inland DATETIME = ?;
DECLARE @DeliveryAddress NVARCHAR(50) =  ?;
DECLARE @Transport_Mode_final_DeliveryAddress NVARCHAR(50) =  ?;
DECLARE @Direct_Truck BIT =
 CASE 
        WHEN ? IN ('true','1') THEN 1
        WHEN ? IN ('false','0','') THEN 0
        ELSE NULL
 END;

-- Test first - show the decoded JSON
SELECT @JsonData as DecodedJson;

-- Parse the JSON
SELECT 
    JSON_VALUE(value, '$.CustomerID') as CustomerID,
    JSON_VALUE(value, '$.MBL_ID') as MBL_ID,
    JSON_VALUE(value, '$.ContainerID') as ContainerID
FROM OPENJSON(@JsonData) AS value;