-- Decode Base64 back to JSON
DECLARE @Base64Data NVARCHAR(MAX) = '{{steps.PrepareDatabase64json.base64Json}}';
DECLARE @JsonData NVARCHAR(MAX) = CAST('' AS XML).value('xs:base64Binary(xs:string(sql:variable("@Base64Data")))', 'VARBINARY(MAX)');
SET @JsonData = CONVERT(NVARCHAR(MAX), @JsonData);

DECLARE @Pincode NVARCHAR(50) = {{ui.MultiEditform10.value.Pincode}};
DECLARE @DropOff_Terminal NVARCHAR(50) = {{ui.MultiEditform10.value.DropOff_Terminal}};
DECLARE @DropOff_Terminal_TIR NVARCHAR(50) =  {{ui.MultiEditform10.value.DropOff_Terminal_TIR}};
DECLARE @ETA_DeliveryAddress DATETIME = {{moment(ui.MultiEditform10.value.ETA_DeliveryAddress).toISOString()}};
DECLARE @ATA_Terminal_Inland DATETIME = {{moment(ui.MultiEditform10.value.ATA_Terminal_Inland).toISOString()}};
DECLARE @DeliveryAddress NVARCHAR(50) =  {{ui.MultiEditform10.value.DeliveryAddress}};
DECLARE @Transport_Mode_final_DeliveryAddress NVARCHAR(50) =  {{ui.MultiEditform10.value.Transport_Mode_final_DeliveryAddress}};
DECLARE @Direct_Truck BIT =
 CASE 
        WHEN {{ui.MultiEditform10.value.Direct_Truck}} IN ('true','1') THEN 1
        WHEN {{ui.MultiEditform10.value.Direct_Truck}} IN ('false','0','') THEN 0
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