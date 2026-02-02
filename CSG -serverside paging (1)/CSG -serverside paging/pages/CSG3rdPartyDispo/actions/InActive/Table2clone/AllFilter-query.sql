DECLARE @PageNumber INT = {{ui.ontable11.paginationOffset}} / {{ui.ontable11.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable11.pageSize}};
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
    AND ({{ ui.ontable11.filters.Status_Dispo }} IS NULL OR d.Status_Dispo LIKE '%' + {{ ui.ontable11.filters.Status_Dispo }} + '%')
    AND ({{ ui.ontable11.filters.Condition }} IS NULL OR d.Condition LIKE '%' + {{ ui.ontable11.filters.Condition }} + '%')
    AND ({{ ui.ontable11.filters.Voyage }} IS NULL OR d.Voyage LIKE '%' + {{ ui.ontable11.filters.Voyage }} + '%')
    AND ({{ ui.ontable11.filters.ContainerSize }} IS NULL OR d.ContainerSize LIKE '%' + {{ ui.ontable11.filters.ContainerSize }} + '%')
    AND ({{ ui.ontable11.filters.CustomerID }} IS NULL OR d.CustomerID LIKE '%' + {{ ui.ontable11.filters.CustomerID }} + '%')
    AND ({{ ui.ontable11.filters.MBL_ID }} IS NULL OR d.MBL_ID LIKE '%' + {{ ui.ontable11.filters.MBL_ID }} + '%')
    AND ({{ ui.ontable11.filters.ContainerID }} IS NULL OR d.ContainerID LIKE '%' + {{ ui.ontable11.filters.ContainerID }} + '%')
    AND ({{ ui.ontable11.filters.Status_Transport }} IS NULL OR d.Status_Transport LIKE '%' + {{ ui.ontable11.filters.Status_Transport }} + '%')
    AND ({{ ui.ontable11.filters.Broker }} IS NULL OR d.Broker LIKE '%' + {{ ui.ontable11.filters.Broker }} + '%')
    AND ({{ ui.ontable11.filters.Carrier }} IS NULL OR d.Carrier LIKE '%' + {{ ui.ontable11.filters.Carrier }} + '%')
    AND ({{ ui.ontable11.filters.Vessel }} IS NULL OR d.Vessel LIKE '%' + {{ ui.ontable11.filters.Vessel }} + '%')
    AND ({{ ui.ontable11.filters.PortOfDischarge_Lima }} IS NULL OR d.PortOfDischarge_Lima LIKE '%' + {{ ui.ontable11.filters.PortOfDischarge_Lima }} + '%')
    AND ({{ ui.ontable11.filters.PackingMethod }} IS NULL OR d.PackingMethod LIKE '%' + {{ ui.ontable11.filters.PackingMethod }} + '%')
    AND ({{ ui.ontable11.filters.TotalWeight }} IS NULL OR CAST(d.TotalWeight AS NVARCHAR) LIKE '%' + {{ ui.ontable11.filters.TotalWeight }} + '%')
    AND ({{ ui.ontable11.filters.last_eventID }} IS NULL OR d.last_eventID LIKE '%' + {{ ui.ontable11.filters.last_eventID }} + '%')
    AND ({{ ui.ontable11.filters.PortOfLoading_Lima }} IS NULL OR d.PortOfLoading_Lima LIKE '%' + {{ ui.ontable11.filters.PortOfLoading_Lima }} + '%')
    AND ({{ ui.ontable11.filters.Transport_Mode_Terminal }} IS NULL OR d.Transport_Mode_Terminal LIKE '%' + {{ ui.ontable11.filters.Transport_Mode_Terminal }} + '%')
    AND ({{ ui.ontable11.filters.Transport_Mode_final_DeliveryAddress }} IS NULL OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + {{ ui.ontable11.filters.Transport_Mode_final_DeliveryAddress }} + '%')
    AND ({{ ui.ontable11.filters.Terminal_Inland_CundA }} IS NULL OR d.Terminal_Inland_CundA LIKE '%' + {{ ui.ontable11.filters.Terminal_Inland_CundA }} + '%')
    AND ({{ ui.ontable11.filters.DeliveryAddress }} IS NULL OR d.DeliveryAddress LIKE '%' + {{ ui.ontable11.filters.DeliveryAddress }} + '%')
    AND ({{ ui.ontable11.filters.MBL_No }} IS NULL OR tm.Wert LIKE '%' + {{ ui.ontable11.filters.MBL_No }} + '%')
    AND ({{ ui.ontable11.filters.Container_No }} IS NULL OR tm2.Wert LIKE '%' + {{ ui.ontable11.filters.Container_No }} + '%')
    AND ({{ ui.ontable11.filters.DropOff_Terminal }} IS NULL OR d.DropOff_Terminal LIKE '%' + {{ ui.ontable11.filters.DropOff_Terminal }} + '%')
    AND ({{ ui.ontable11.filters.Pincode }} IS NULL OR d.Pincode LIKE '%' + {{ ui.ontable11.filters.Pincode }} + '%')
    AND ({{ ui.ontable11.filters.DropOff_Terminal_TIR }} IS NULL OR d.DropOff_Terminal_TIR LIKE '%' + {{ ui.ontable11.filters.DropOff_Terminal_TIR }} + '%')
    AND ({{ ui.ontable11.filters.Remarks }} IS NULL OR d.Remarks LIKE '%' + {{ ui.ontable11.filters.Remarks }} + '%')
    AND ({{ ui.ontable11.filters.HouseBill }} IS NULL OR d.HouseBill LIKE '%' + {{ ui.ontable11.filters.HouseBill }} + '%')
    AND ({{ ui.ontable11.filters.PortOfLoading_UNLOCO }} IS NULL OR d.PortOfLoading_UNLOCO LIKE '%' + {{ ui.ontable11.filters.PortOfLoading_UNLOCO }} + '%')
    AND ({{ ui.ontable11.filters.DeliveryAddress_CTV }} IS NULL OR d.DeliveryAddress_CTV LIKE '%' + {{ ui.ontable11.filters.DeliveryAddress_CTV }} + '%')
    AND ({{ ui.ontable11.filters.PortOfDischarge_UNLOCO_CTV }} IS NULL OR d.PortOfDischarge_UNLOCO_CTV LIKE '%' + {{ ui.ontable11.filters.PortOfDischarge_UNLOCO_CTV }} + '%')
    AND ({{ ui.ontable11.filters.Transport_Mode_Terminal_CTV }} IS NULL OR d.Transport_Mode_Terminal_CTV LIKE '%' + {{ ui.ontable11.filters.Transport_Mode_Terminal_CTV }} + '%')
    AND ({{ ui.ontable11.filters.Carrier_CTV }} IS NULL OR d.Carrier_CTV LIKE '%' + {{ ui.ontable11.filters.Carrier_CTV }} + '%')
    AND ({{ ui.ontable11.filters.customs_document_number }} IS NULL OR d.customs_document_number LIKE '%' + {{ ui.ontable11.filters.customs_document_number }} + '%')
    AND ({{ ui.ontable11.filters.customs_document_type }} IS NULL OR d.customs_document_type LIKE '%' + {{ ui.ontable11.filters.customs_document_type }} + '%')
    AND ({{ ui.ontable11.filters.Terminal_Inland_CTV }} IS NULL OR d.Terminal_Inland_CTV LIKE '%' + {{ ui.ontable11.filters.Terminal_Inland_CTV }} + '%')
    AND ({{ ui.ontable11.filters.pinState }} IS NULL OR d.pinState LIKE '%' + {{ ui.ontable11.filters.pinState }} + '%')
    AND ({{ ui.ontable11.filters.nationalTransportState }} IS NULL OR d.nationalTransportState LIKE '%' + {{ ui.ontable11.filters.nationalTransportState }} + '%')
    AND ({{ ui.ontable11.filters.finalDeliveryState }} IS NULL OR d.finalDeliveryState LIKE '%' + {{ ui.ontable11.filters.finalDeliveryState }} + '%')
    AND ({{ ui.ontable11.filters.emptyReturnState }} IS NULL OR d.emptyReturnState LIKE '%' + {{ ui.ontable11.filters.emptyReturnState }} + '%')
    AND ({{ ui.ontable11.filters.eventType }} IS NULL OR d.eventType LIKE '%' + {{ ui.ontable11.filters.eventType }} + '%')

    -- BIT / boolean filters
    AND ({{ ui.ontable11.filters.AdvertFlag }} IS NULL OR d.AdvertFlag = {{ ui.ontable11.filters.AdvertFlag }})
    AND ({{ ui.ontable11.filters.RealAdvertFlag }} IS NULL OR d.RealAdvertFlag = {{ ui.ontable11.filters.RealAdvertFlag }})
    AND ({{ ui.ontable11.filters.Direct_Truck }} IS NULL OR d.Direct_Truck = {{ ui.ontable11.filters.Direct_Truck }})
    AND ({{ ui.ontable11.filters.todo }} IS NULL OR d.todo = {{ ui.ontable11.filters.todo }})
    AND ({{ ui.ontable11.filters.TAC }} IS NULL OR d.TAC = {{ ui.ontable11.filters.TAC }})
    AND ({{ ui.ontable11.filters.into_CW1 }} IS NULL OR d.into_CW1 = {{ ui.ontable11.filters.into_CW1 }})
    AND ({{ ui.ontable11.filters.to_Customer }} IS NULL OR d.to_Customer = {{ ui.ontable11.filters.to_Customer }})
    AND ({{ ui.ontable11.filters.to_Transporter }} IS NULL OR d.to_Transporter = {{ ui.ontable11.filters.to_Transporter }})
    AND ({{ ui.ontable11.filters.new }} IS NULL OR d.new = {{ ui.ontable11.filters.new }})
    AND ({{ ui.ontable11.filters.Cancelation_Send_To_CTV }} IS NULL OR d.Cancelation_Send_To_CTV = {{ ui.ontable11.filters.Cancelation_Send_To_CTV }})

    AND ({{ ui.ontable11.filters.ctv_booking_id }} IS NULL OR CAST(d.ctv_booking_id AS NVARCHAR) LIKE '%' + {{ ui.ontable11.filters.ctv_booking_id }} + '%')

    -- Datetime filters (all columns from your schema)
    AND (FORMAT(d.TransmissionTimestamp,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.TransmissionTimestamp ?? "" }} + '%' OR {{ ui.ontable11.filters.TransmissionTimestamp ?? "" }} = '')
    AND (FORMAT(d.ATA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ATA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable11.filters.ATA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.ATA_DropOff_Terminal,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ATA_DropOff_Terminal ?? "" }} + '%' OR {{ ui.ontable11.filters.ATA_DropOff_Terminal ?? "" }} = '')
    AND (FORMAT(d.ATA_Seaport,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ATA_Seaport ?? "" }} + '%' OR {{ ui.ontable11.filters.ATA_Seaport ?? "" }} = '')
    AND (FORMAT(d.ATA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ATA_Terminal_Inland ?? "" }} + '%' OR {{ ui.ontable11.filters.ATA_Terminal_Inland ?? "" }} = '')
    AND (FORMAT(d.ATD_Pickup_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ATD_Pickup_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable11.filters.ATD_Pickup_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ATD_Seaport,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ATD_Seaport ?? "" }} + '%' OR {{ ui.ontable11.filters.ATD_Seaport ?? "" }} = '')
    AND (FORMAT(d.ATD_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ATD_Terminal_Inland ?? "" }} + '%' OR {{ ui.ontable11.filters.ATD_Terminal_Inland ?? "" }} = '')
    AND (FORMAT(d.Containerverfuegbarkeit,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.Containerverfuegbarkeit ?? "" }} + '%' OR {{ ui.ontable11.filters.Containerverfuegbarkeit ?? "" }} = '')
    AND (FORMAT(d.CTV_ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.CTV_ETA_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable11.filters.CTV_ETA_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_Deliveryadress_CTV ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Deliveryadress_CTV ?? "" }} = '')
    AND (FORMAT(d.ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ETA_Seaport,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_Seaport ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Seaport ?? "" }} = '')
    AND (FORMAT(d.ETA_Service_Provider,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_Service_Provider ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Service_Provider ?? "" }} = '')
    AND (FORMAT(d.ETA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_Terminal_Inland ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Terminal_Inland ?? "" }} = '')
    AND (FORMAT(d.ETA_Terminal_Inland_Vorgabe_NTL,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_Terminal_Inland_Vorgabe_NTL ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Terminal_Inland_Vorgabe_NTL ?? "" }} = '')
    AND (FORMAT(d.ETD_Pickup_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETD_Pickup_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable11.filters.ETD_Pickup_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ETD_PortOfLoading,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETD_PortOfLoading ?? "" }} + '%' OR {{ ui.ontable11.filters.ETD_PortOfLoading ?? "" }} = '')
    AND (FORMAT(d.ETD_Seaport,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETD_Seaport ?? "" }} + '%' OR {{ ui.ontable11.filters.ETD_Seaport ?? "" }} = '')
    AND (FORMAT(d.DeliveryInfo_send_to_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.DeliveryInfo_send_to_CTV ?? "" }} + '%' OR {{ ui.ontable11.filters.DeliveryInfo_send_to_CTV ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_Deliveryadress_CTV ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Deliveryadress_CTV ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_Deliveryadress_CTV ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Deliveryadress_CTV ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.TAC_sent,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.TAC_sent ?? "" }} + '%' OR {{ ui.ontable11.filters.TAC_sent ?? "" }} = '')
    AND (FORMAT(d.ETA_Delivery_Address_Update_TimeStamp,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} = '')
    AND (FORMAT(d.Return_Date_to_Depot,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.Return_Date_to_Depot ?? "" }} + '%' OR {{ ui.ontable11.filters.Return_Date_to_Depot ?? "" }} = '')
    AND (FORMAT(d.final_date_delivery_address,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.final_date_delivery_address ?? "" }} + '%' OR {{ ui.ontable11.filters.final_date_delivery_address ?? "" }} = '')
    AND (FORMAT(d.EarliestAdvertDate,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.EarliestAdvertDate ?? "" }} + '%' OR {{ ui.ontable11.filters.EarliestAdvertDate ?? "" }} = '')
    AND (FORMAT(d.EarliestRealAdvertDate,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.EarliestRealAdvertDate ?? "" }} + '%' OR {{ ui.ontable11.filters.EarliestRealAdvertDate ?? "" }} = '')
    AND (FORMAT(d.CTV_ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.CTV_ETA_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable11.filters.CTV_ETA_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.ETA_DeliveryAddress_CTV ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_DeliveryAddress_CTV ?? "" }} = '')
    AND (FORMAT(d.pinRequested,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable11.filters.pinRequested ?? "" }} + '%' OR {{ ui.ontable11.filters.pinRequested ?? "" }} = '')

/*
ORDER BY

  CASE WHEN UPPER('{{ ui.ontable11.sortDirection }}') <> 'DESC' THEN
    CASE '{{ ui.ontable11.sortColumn }}'
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

  CASE WHEN UPPER('{{ ui.ontable11.sortDirection }}') = 'DESC' THEN
    CASE '{{ ui.ontable11.sortColumn }}'
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
