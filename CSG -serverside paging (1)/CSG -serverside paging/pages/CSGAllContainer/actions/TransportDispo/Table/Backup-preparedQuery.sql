DECLARE @PageNumber INT = ? / ? + 1;
DECLARE @PageSize INT = ?;
DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

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
    AND (? IS NULL OR d.DeliveryAddress LIKE '%' + ? + '%')
    AND (? IS NULL OR tm.Wert LIKE '%' + ? + '%')
    AND (? IS NULL OR tm2.Wert LIKE '%' + ? + '%')

    -- BIT / boolean filters
    AND (? IS NULL OR d.AdvertFlag = ?)
    AND (? IS NULL OR d.RealAdvertFlag = ?)
    AND (? IS NULL OR d.Direct_Truck = ?)
    AND (? IS NULL OR d.todo = ?)
    AND (? IS NULL OR d.TAC = ?)
    AND (? IS NULL OR d.into_CW1 = ?)
    AND (? IS NULL OR d.to_Customer = ?)
    AND (? IS NULL OR d.to_Transporter = ?)
    

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
    AND (FORMAT(d.Return_Date_to_Depot,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')
    AND (FORMAT(d.final_date_delivery_address,'dd-MM-yyyy') LIKE '%' + ? + '%' OR ? = '')

ORDER BY d.TransmissionTimestamp
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
