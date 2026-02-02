DECLARE @PageNumber INT = {{ui.ontable9.paginationOffset}} / {{ui.ontable9.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable9.pageSize}};
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
    AND ({{ ui.ontable9.filters.Status_Dispo }} IS NULL OR d.Status_Dispo LIKE '%' + {{ ui.ontable9.filters.Status_Dispo }} + '%')
    AND ({{ ui.ontable9.filters.Condition }} IS NULL OR d.Condition LIKE '%' + {{ ui.ontable9.filters.Condition }} + '%')
    AND ({{ ui.ontable9.filters.Voyage }} IS NULL OR d.Voyage LIKE '%' + {{ ui.ontable9.filters.Voyage }} + '%')
    AND ({{ ui.ontable9.filters.ContainerSize }} IS NULL OR d.ContainerSize LIKE '%' + {{ ui.ontable9.filters.ContainerSize }} + '%')
    AND ({{ ui.ontable9.filters.CustomerID }} IS NULL OR d.CustomerID LIKE '%' + {{ ui.ontable9.filters.CustomerID }} + '%')
    AND ({{ ui.ontable9.filters.MBL_ID }} IS NULL OR d.MBL_ID LIKE '%' + {{ ui.ontable9.filters.MBL_ID }} + '%')
    AND ({{ ui.ontable9.filters.ContainerID }} IS NULL OR d.ContainerID LIKE '%' + {{ ui.ontable9.filters.ContainerID }} + '%')
    AND ({{ ui.ontable9.filters.Status_Transport }} IS NULL OR d.Status_Transport LIKE '%' + {{ ui.ontable9.filters.Status_Transport }} + '%')
    AND ({{ ui.ontable9.filters.Broker }} IS NULL OR d.Broker LIKE '%' + {{ ui.ontable9.filters.Broker }} + '%')
    AND ({{ ui.ontable9.filters.Carrier }} IS NULL OR d.Carrier LIKE '%' + {{ ui.ontable9.filters.Carrier }} + '%')
    AND ({{ ui.ontable9.filters.Vessel }} IS NULL OR d.Vessel LIKE '%' + {{ ui.ontable9.filters.Vessel }} + '%')
    AND ({{ ui.ontable9.filters.PortOfDischarge_Lima }} IS NULL OR d.PortOfDischarge_Lima LIKE '%' + {{ ui.ontable9.filters.PortOfDischarge_Lima }} + '%')
    AND ({{ ui.ontable9.filters.PackingMethod }} IS NULL OR d.PackingMethod LIKE '%' + {{ ui.ontable9.filters.PackingMethod }} + '%')
    AND ({{ ui.ontable9.filters.TotalWeight }} IS NULL OR CAST(d.TotalWeight AS NVARCHAR) LIKE '%' + {{ ui.ontable9.filters.TotalWeight }} + '%')
    AND ({{ ui.ontable9.filters.last_eventID }} IS NULL OR d.last_eventID LIKE '%' + {{ ui.ontable9.filters.last_eventID }} + '%')
    AND ({{ ui.ontable9.filters.PortOfLoading_Lima }} IS NULL OR d.PortOfLoading_Lima LIKE '%' + {{ ui.ontable9.filters.PortOfLoading_Lima }} + '%')
    AND ({{ ui.ontable9.filters.Transport_Mode_Terminal }} IS NULL OR d.Transport_Mode_Terminal LIKE '%' + {{ ui.ontable9.filters.Transport_Mode_Terminal }} + '%')
    AND ({{ ui.ontable9.filters.Transport_Mode_final_DeliveryAddress }} IS NULL OR d.Transport_Mode_final_DeliveryAddress LIKE '%' + {{ ui.ontable9.filters.Transport_Mode_final_DeliveryAddress }} + '%')
    AND ({{ ui.ontable9.filters.DeliveryAddress }} IS NULL OR d.DeliveryAddress LIKE '%' + {{ ui.ontable9.filters.DeliveryAddress }} + '%')
    AND ({{ ui.ontable9.filters.MBL_No }} IS NULL OR tm.Wert LIKE '%' + {{ ui.ontable9.filters.MBL_No }} + '%')
    AND ({{ ui.ontable9.filters.Container_No }} IS NULL OR tm2.Wert LIKE '%' + {{ ui.ontable9.filters.Container_No }} + '%')

    -- BIT / boolean filters
    AND ({{ ui.ontable9.filters.AdvertFlag }} IS NULL OR d.AdvertFlag = {{ ui.ontable9.filters.AdvertFlag }})
    AND ({{ ui.ontable9.filters.RealAdvertFlag }} IS NULL OR d.RealAdvertFlag = {{ ui.ontable9.filters.RealAdvertFlag }})
    AND ({{ ui.ontable9.filters.Direct_Truck }} IS NULL OR d.Direct_Truck = {{ ui.ontable9.filters.Direct_Truck }})
    AND ({{ ui.ontable9.filters.todo }} IS NULL OR d.todo = {{ ui.ontable9.filters.todo }})
    AND ({{ ui.ontable9.filters.TAC }} IS NULL OR d.TAC = {{ ui.ontable9.filters.TAC }})
    AND ({{ ui.ontable9.filters.into_CW1 }} IS NULL OR d.into_CW1 = {{ ui.ontable9.filters.into_CW1 }})
    AND ({{ ui.ontable9.filters.to_Customer }} IS NULL OR d.to_Customer = {{ ui.ontable9.filters.to_Customer }})
    AND ({{ ui.ontable9.filters.to_Transporter }} IS NULL OR d.to_Transporter = {{ ui.ontable9.filters.to_Transporter }})
    

    -- Datetime filters (all columns from your schema)
    AND (FORMAT(d.TransmissionTimestamp,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.TransmissionTimestamp ?? "" }} + '%' OR {{ ui.ontable9.filters.TransmissionTimestamp ?? "" }} = '')
    AND (FORMAT(d.ATA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ATA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable9.filters.ATA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.ATA_DropOff_Terminal,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ATA_DropOff_Terminal ?? "" }} + '%' OR {{ ui.ontable9.filters.ATA_DropOff_Terminal ?? "" }} = '')
    AND (FORMAT(d.ATA_Seaport,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ATA_Seaport ?? "" }} + '%' OR {{ ui.ontable9.filters.ATA_Seaport ?? "" }} = '')
    AND (FORMAT(d.ATA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ATA_Terminal_Inland ?? "" }} + '%' OR {{ ui.ontable9.filters.ATA_Terminal_Inland ?? "" }} = '')
    AND (FORMAT(d.ATD_Pickup_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ATD_Pickup_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable9.filters.ATD_Pickup_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ATD_Seaport,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ATD_Seaport ?? "" }} + '%' OR {{ ui.ontable9.filters.ATD_Seaport ?? "" }} = '')
    AND (FORMAT(d.ATD_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ATD_Terminal_Inland ?? "" }} + '%' OR {{ ui.ontable9.filters.ATD_Terminal_Inland ?? "" }} = '')
    AND (FORMAT(d.Containerverfuegbarkeit,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.Containerverfuegbarkeit ?? "" }} + '%' OR {{ ui.ontable9.filters.Containerverfuegbarkeit ?? "" }} = '')
    AND (FORMAT(d.CTV_ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.CTV_ETA_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable9.filters.CTV_ETA_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_Deliveryadress_CTV ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_Deliveryadress_CTV ?? "" }} = '')
    AND (FORMAT(d.ETA_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ETA_Seaport,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_Seaport ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_Seaport ?? "" }} = '')
    AND (FORMAT(d.ETA_Service_Provider,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_Service_Provider ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_Service_Provider ?? "" }} = '')
    AND (FORMAT(d.ETA_Terminal_Inland,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_Terminal_Inland ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_Terminal_Inland ?? "" }} = '')
    AND (FORMAT(d.ETA_Terminal_Inland_Vorgabe_NTL,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_Terminal_Inland_Vorgabe_NTL ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_Terminal_Inland_Vorgabe_NTL ?? "" }} = '')
    AND (FORMAT(d.ETD_Pickup_PortOfDischarge,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETD_Pickup_PortOfDischarge ?? "" }} + '%' OR {{ ui.ontable9.filters.ETD_Pickup_PortOfDischarge ?? "" }} = '')
    AND (FORMAT(d.ETD_PortOfLoading,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETD_PortOfLoading ?? "" }} + '%' OR {{ ui.ontable9.filters.ETD_PortOfLoading ?? "" }} = '')
    AND (FORMAT(d.ETD_Seaport,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETD_Seaport ?? "" }} + '%' OR {{ ui.ontable9.filters.ETD_Seaport ?? "" }} = '')
    AND (FORMAT(d.DeliveryInfo_send_to_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.DeliveryInfo_send_to_CTV ?? "" }} + '%' OR {{ ui.ontable9.filters.DeliveryInfo_send_to_CTV ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_Deliveryadress_CTV ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_Deliveryadress_CTV ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.ETA_Deliveryadress_CTV,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_Deliveryadress_CTV ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_Deliveryadress_CTV ?? "" }} = '')
    AND (FORMAT(d.ETA_DeliveryAddress,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.ETA_DeliveryAddress ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_DeliveryAddress ?? "" }} = '')
    AND (FORMAT(d.TAC_sent,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.TAC_sent ?? "" }} + '%' OR {{ ui.ontable9.filters.TAC_sent ?? "" }} = '')
    AND (FORMAT(d.Return_Date_to_Depot,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.Return_Date_to_Depot ?? "" }} + '%' OR {{ ui.ontable9.filters.Return_Date_to_Depot ?? "" }} = '')
    AND (FORMAT(d.final_date_delivery_address,'dd-MM-yyyy') LIKE '%' + {{ ui.ontable9.filters.final_date_delivery_address ?? "" }} + '%' OR {{ ui.ontable9.filters.final_date_delivery_address ?? "" }} = '')

ORDER BY d.TransmissionTimestamp
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
