DECLARE @PageNumber INT = ? / ? + 1;
DECLARE @PageSize INT = ?;
DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

;WITH HistoryCTE AS (
    SELECT 
        h.Container_Number,
        h.Timestamp,
        ROW_NUMBER() OVER (
            PARTITION BY h.Container_Number 
            ORDER BY h.Timestamp ASC
        ) AS rn
    FROM dbo.Transport_Dispo_History h
    WHERE h.ATA_Terminal_Inland IS NOT NULL
)
SELECT 
    d.*,
    tm.Wert AS MBL_No,
    tm2.Wert AS Container_No,
    (
        SELECT COUNT(*)
        FROM dbo.transport_messages msg
        WHERE msg.Transport_Dispo_ID = d.Transport_Dispo_ID
    ) AS error_count,
    ft.Timestamp AS FirstTimestamp
FROM dbo.transport_UI AS d
INNER JOIN dbo.Transport_Mapping tm
    ON tm.Schluessel = d.MBL_ID 
    AND tm.Typ = 'M'
INNER JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID 
    AND tm2.Typ = 'C'
LEFT JOIN HistoryCTE ft
    ON ft.Container_Number = tm2.Wert 
    AND ft.rn = 1
WHERE
    -- Delivered/cancellation logic
    (d.Delivered = 0 OR d.Delivered IS NULL)
    AND NOT (
        d.Status_Transport = 'transportAssignmentCancellation'
        AND d.Status_Dispo IS NULL
    )



    -- NVARCHAR / string filters
    AND (? IS NULL OR d.Status_Dispo LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Condition LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Voyage LIKE '%' + ? + '%')
    AND (? IS NULL OR d.ContainerSize LIKE '%' + ? + '%')
    AND (? IS NULL OR d.CustomerID LIKE '%' + ? + '%')
    AND (? IS NULL OR d.MBL_ID LIKE '%' + ? + '%')
    AND (? IS NULL OR d.ContainerID LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Status_Transport LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Broker LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Carrier LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Vessel LIKE '%' + ? + '%')
    AND (? IS NULL OR d.PortOfDischarge_Lima LIKE '%' + ? + '%')
    AND (? IS NULL OR d.PackingMethod LIKE '%' + ? + '%')
    AND (? IS NULL OR CAST(d.TotalWeight AS NVARCHAR) LIKE '%' + ? + '%')
    AND (? IS NULL OR d.last_eventID LIKE '%' + ? + '%')
    AND (? IS NULL OR d.PortOfLoading_Lima LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Transport_Mode_Terminal LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Terminal_Inland_CundA LIKE '%' + ? + '%')
    AND (? IS NULL OR d.DeliveryAddress LIKE '%' + ? + '%')
    AND (? IS NULL OR tm.Wert LIKE '%' + ? + '%')
    AND (? IS NULL OR tm2.Wert LIKE '%' + ? + '%')
    AND (? IS NULL OR d.DropOff_Terminal LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Pincode LIKE '%' + ? + '%')
    AND (? IS NULL OR d.DropOff_Terminal_TIR LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Remarks LIKE '%' + ? + '%')
    AND (? IS NULL OR d.HouseBill LIKE '%' + ? + '%')
    AND (? IS NULL OR d.PortOfLoading_UNLOCO LIKE '%' + ? + '%')
    AND (? IS NULL OR d.DeliveryAddress_CTV LIKE '%' + ? + '%')
    AND (? IS NULL OR d.PortOfDischarge_UNLOCO_CTV LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Transport_Mode_Terminal_CTV LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Carrier_CTV LIKE '%' + ? + '%')
    AND (? IS NULL OR d.customs_document_number LIKE '%' + ? + '%')
    AND (? IS NULL OR d.customs_document_type LIKE '%' + ? + '%')
    AND (? IS NULL OR d.Terminal_Inland_CTV LIKE '%' + ? + '%')
    AND (? IS NULL OR d.pinState LIKE '%' + ? + '%')
    AND (? IS NULL OR d.nationalTransportState LIKE '%' + ? + '%')
    AND (? IS NULL OR d.finalDeliveryState LIKE '%' + ? + '%')
    AND (? IS NULL OR d.emptyReturnState LIKE '%' + ? + '%')
    AND (? IS NULL OR d.eventType LIKE '%' + ? + '%')

    -- BIT / boolean filters
    AND (? IS NULL OR d.AdvertFlag = ?)
    AND (? IS NULL OR d.RealAdvertFlag = ?)
    AND (? IS NULL OR d.Direct_Truck = ?)
    AND (? IS NULL OR d.todo = ?)
    AND (? IS NULL OR d.TAC = ?)
    AND (? IS NULL OR d.into_CW1 = ?)
    AND (? IS NULL OR d.to_Customer = ?)
    AND (? IS NULL OR d.to_Transporter = ?)
    AND (? IS NULL OR d.new = ?)
    AND (? IS NULL OR d.Cancelation_Send_To_CTV = ?)

    AND (? IS NULL OR CAST(d.ctv_booking_id AS NVARCHAR) LIKE '%' + ? + '%')

    -- Datetime filters (all columns from your schema)
    AND (FORMAT(d.TransmissionTimestamp,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ATA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ATA_DropOff_Terminal,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ATA_Seaport,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ATA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ATD_Pickup_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ATD_Seaport,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ATD_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.Containerverfuegbarkeit,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.CTV_ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_Seaport,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_Service_Provider,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_Terminal_Inland_Vorgabe_NTL,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETD_Pickup_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETD_PortOfLoading,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETD_Seaport,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.DeliveryInfo_send_to_CTV,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.TAC_sent,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_Delivery_Address_Update_TimeStamp,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.Return_Date_to_Depot,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.final_date_delivery_address,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.EarliestAdvertDate,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.EarliestRealAdvertDate,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.CTV_ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.ETA_DeliveryAddress_CTV,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.pinRequested,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')

/*
ORDER BY

  CASE WHEN UPPER('?') <> 'DESC' THEN
    CASE '?'
      WHEN 'CustomerID' THEN CAST(d.CustomerID AS NVARCHAR(4000))
      WHEN 'Voyage' THEN CAST(d.Voyage AS NVARCHAR(4000))
      WHEN 'ContainerSize' THEN CAST(d.ContainerSize AS NVARCHAR(4000))
      WHEN 'MBL_No' THEN CAST(tm.Wert AS NVARCHAR(4000))
      WHEN 'Container_No' THEN CAST(tm2.Wert AS NVARCHAR(4000))
      WHEN 'FirstTimestamp' THEN CONVERT(NVARCHAR(4000), CONVERT(varchar(30), ft.Timestamp, 126))
      WHEN 'TransmissionTimestamp' THEN CONVERT(NVARCHAR(4000), CONVERT(varchar(30), d.TransmissionTimestamp, 126))
      ELSE CONVERT(NVARCHAR(4000), CONVERT(varchar(30), d.TransmissionTimestamp, 126))
    END
  END ASC,

  CASE WHEN UPPER('?') = 'DESC' THEN
    CASE '?'
      WHEN 'CustomerID' THEN CAST(d.CustomerID AS NVARCHAR(4000))
      WHEN 'Voyage' THEN CAST(d.Voyage AS NVARCHAR(4000))
      WHEN 'ContainerSize' THEN CAST(d.ContainerSize AS NVARCHAR(4000))
      WHEN 'MBL_No' THEN CAST(tm.Wert AS NVARCHAR(4000))
      WHEN 'Container_No' THEN CAST(tm2.Wert AS NVARCHAR(4000))
      WHEN 'FirstTimestamp' THEN CONVERT(NVARCHAR(4000), CONVERT(varchar(30), ft.Timestamp, 126))
      WHEN 'TransmissionTimestamp' THEN CONVERT(NVARCHAR(4000), CONVERT(varchar(30), d.TransmissionTimestamp, 126))
      ELSE CONVERT(NVARCHAR(4000), CONVERT(varchar(30), d.TransmissionTimestamp, 126))
    END
  END DESC
*/

ORDER BY d.TransmissionTimestamp DESC

OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
