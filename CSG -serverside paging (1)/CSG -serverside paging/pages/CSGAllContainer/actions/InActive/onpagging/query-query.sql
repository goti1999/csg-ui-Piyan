-- Pagination Variables
DECLARE @PageNumber INT = {{ui.ontable.paginationOffset}} / {{ui.ontable.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable.pageSize}};
DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

-- Sorting setup
DECLARE @SortColumn NVARCHAR(100) = '{{ ui.ontable.sortColumn ?? "MBL_No" }}';
DECLARE @SortDirection NVARCHAR(4) = '{{ ui.ontable.sortDirection ?? "ASC" }}';

-- Declare filter variables with proper null handling
DECLARE @CustomerID NVARCHAR(255) = '{{ ui.ontable.filters.CustomerID ?? "" }}';
DECLARE @MBL_ID NVARCHAR(255) = '{{ ui.ontable.filters.MBL_ID ?? "" }}';
DECLARE @ContainerID NVARCHAR(255) = '{{ ui.ontable.filters.ContainerID ?? "" }}';
DECLARE @Status NVARCHAR(255) = '{{ ui.ontable.filters.Status ?? "" }}';
DECLARE @TransmissionTimestamp NVARCHAR(255) = '{{ ui.ontable.filters.TransmissionTimestamp ?? "" }}';
DECLARE @Voyage NVARCHAR(255) = '{{ ui.ontable.filters.Voyage ?? "" }}';
DECLARE @ContainerSize NVARCHAR(255) = '{{ ui.ontable.filters.ContainerSize ?? "" }}';
DECLARE @Broker NVARCHAR(255) = '{{ ui.ontable.filters.Broker ?? "" }}';
DECLARE @Carrier NVARCHAR(255) = '{{ ui.ontable.filters.Carrier ?? "" }}';
DECLARE @Vessel NVARCHAR(255) = '{{ ui.ontable.filters.Vessel ?? "" }}';
DECLARE @PortOfDischarge_Lima NVARCHAR(255) = '{{ ui.ontable.filters.PortOfDischarge_Lima ?? "" }}';
DECLARE @ETA_PortOfDischarge NVARCHAR(255) = '{{ ui.ontable.filters.ETA_PortOfDischarge ?? "" }}';
DECLARE @PackingMethod NVARCHAR(255) = '{{ ui.ontable.filters.PackingMethod ?? "" }}';
DECLARE @TotalWeight NVARCHAR(255) = '{{ ui.ontable.filters.TotalWeight ?? "" }}';
DECLARE @AdvertFlag NVARCHAR(255) = '{{ ui.ontable.filters.AdvertFlag ?? "" }}';
DECLARE @RealAdvertFlag NVARCHAR(255) = '{{ ui.ontable.filters.RealAdvertFlag ?? "" }}';
DECLARE @EarliestAdvertDate NVARCHAR(255) = '{{ ui.ontable.filters.EarliestAdvertDate ?? "" }}';
DECLARE @EarliestRealAdvertDate NVARCHAR(255) = '{{ ui.ontable.filters.EarliestRealAdvertDate ?? "" }}';
DECLARE @todo NVARCHAR(255) = '{{ ui.ontable.filters.todo ?? "" }}';
DECLARE @last_eventID NVARCHAR(255) = '{{ ui.ontable.filters.last_eventID ?? "" }}';
DECLARE @PortOfLoading_Lima NVARCHAR(255) = '{{ ui.ontable.filters.PortOfLoading_Lima ?? "" }}';
DECLARE @ETD_PortOfLoading NVARCHAR(255) = '{{ ui.ontable.filters.ETD_PortOfLoading ?? "" }}';
DECLARE @Terminal_Inland_Vorgabe_NTL NVARCHAR(255) = '{{ ui.ontable.filters.Terminal_Inland_Vorgabe_NTL ?? "" }}';
DECLARE @ETA_Terminal_Inland NVARCHAR(255) = '{{ ui.ontable.filters.ETA_Terminal_Inland ?? "" }}';
DECLARE @DeliveryAddress NVARCHAR(255) = '{{ ui.ontable.filters.DeliveryAddress ?? "" }}';
DECLARE @ETA_DeliveryAddress NVARCHAR(255) = '{{ ui.ontable.filters.ETA_DeliveryAddress ?? "" }}';
DECLARE @Transport_Mode_Terminal NVARCHAR(255) = '{{ ui.ontable.filters.Transport_Mode_Terminal ?? "" }}';
DECLARE @Transport_Mode_final_DeliveryAddress NVARCHAR(255) = '{{ ui.ontable.filters.Transport_Mode_final_DeliveryAddress ?? "" }}';
DECLARE @ATA_DeliveryAddress NVARCHAR(255) = '{{ ui.ontable.filters.ATA_DeliveryAddress ?? "" }}';
DECLARE @transport_Dispo_ID NVARCHAR(255) = '{{ ui.ontable.filters.transport_Dispo_ID ?? "" }}';
DECLARE @Condition NVARCHAR(255) = '{{ ui.ontable.filters.Condition ?? "" }}';
DECLARE @into_CW1 NVARCHAR(255) = '{{ ui.ontable.filters.into_CW1 ?? "" }}';
DECLARE @to_Customer NVARCHAR(255) = '{{ ui.ontable.filters.to_Customer ?? "" }}';
DECLARE @to_Transporter NVARCHAR(255) = '{{ ui.ontable.filters.to_Transporter ?? "" }}';
DECLARE @DropOff_Terminal NVARCHAR(255) = '{{ ui.ontable.filters.DropOff_Terminal ?? "" }}';
DECLARE @Terminal_PortOfDischarge NVARCHAR(255) = '{{ ui.ontable.filters.Terminal_PortOfDischarge ?? "" }}';
DECLARE @Pincode NVARCHAR(255) = '{{ ui.ontable.filters.Pincode ?? "" }}';
DECLARE @DropOff_Terminal_TIR NVARCHAR(255) = '{{ ui.ontable.filters.DropOff_Terminal_TIR ?? "" }}';
DECLARE @Delivered NVARCHAR(255) = '{{ ui.ontable.filters.Delivered ?? "" }}';
DECLARE @Remarks NVARCHAR(255) = '{{ ui.ontable.filters.Remarks ?? "" }}';
DECLARE @HouseBill NVARCHAR(255) = '{{ ui.ontable.filters.HouseBill ?? "" }}';
DECLARE @Containerverfuegbarkeit NVARCHAR(255) = '{{ ui.ontable.filters.Containerverfuegbarkeit ?? "" }}';
DECLARE @ETA_Service_Provider NVARCHAR(255) = '{{ ui.ontable.filters.ETA_Service_Provider ?? "" }}';
DECLARE @ATA_Terminal_Inland NVARCHAR(255) = '{{ ui.ontable.filters.ATA_Terminal_Inland ?? "" }}';
DECLARE @ATD_Terminal_Inland NVARCHAR(255) = '{{ ui.ontable.filters.ATD_Terminal_Inland ?? "" }}';
DECLARE @Return_Date_to_Depot NVARCHAR(255) = '{{ ui.ontable.filters.Return_Date_to_Depot ?? "" }}';
DECLARE @ATD_Seaport NVARCHAR(255) = '{{ ui.ontable.filters.ATD_Seaport ?? "" }}';
DECLARE @ETD_Seaport NVARCHAR(255) = '{{ ui.ontable.filters.ETD_Seaport ?? "" }}';
DECLARE @ETA_Seaport NVARCHAR(255) = '{{ ui.ontable.filters.ETA_Seaport ?? "" }}';
DECLARE @ATA_Seaport NVARCHAR(255) = '{{ ui.ontable.filters.ATA_Seaport ?? "" }}';
DECLARE @final_date_delivery_address NVARCHAR(255) = '{{ ui.ontable.filters.final_date_delivery_address ?? "" }}';
DECLARE @ctv_booking_id NVARCHAR(255) = '{{ ui.ontable.filters.ctv_booking_id ?? "" }}';
DECLARE @CTV_ETA_PortOfDischarge NVARCHAR(255) = '{{ ui.ontable.filters.CTV_ETA_PortOfDischarge ?? "" }}';
DECLARE @PortOfDischarge_UNLOCO NVARCHAR(255) = '{{ ui.ontable.filters.PortOfDischarge_UNLOCO ?? "" }}';
DECLARE @PortOfLoading_UNLOCO NVARCHAR(255) = '{{ ui.ontable.filters.PortOfLoading_UNLOCO ?? "" }}';
DECLARE @ATA_DropOff_Terminal NVARCHAR(255) = '{{ ui.ontable.filters.ATA_DropOff_Terminal ?? "" }}';
DECLARE @DeliveryAddress_CTV NVARCHAR(255) = '{{ ui.ontable.filters.DeliveryAddress_CTV ?? "" }}';
DECLARE @PortOfDischarge_UNLOCO_CTV NVARCHAR(255) = '{{ ui.ontable.filters.PortOfDischarge_UNLOCO_CTV ?? "" }}';
DECLARE @Transport_Mode_Terminal_CTV NVARCHAR(255) = '{{ ui.ontable.filters.Transport_Mode_Terminal_CTV ?? "" }}';
DECLARE @Carrier_CTV NVARCHAR(255) = '{{ ui.ontable.filters.Carrier_CTV ?? "" }}';
DECLARE @customs_document_number NVARCHAR(255) = '{{ ui.ontable.filters.customs_document_number ?? "" }}';
DECLARE @customs_document_type NVARCHAR(255) = '{{ ui.ontable.filters.customs_document_type ?? "" }}';
DECLARE @Terminal_Inland_CTV NVARCHAR(255) = '{{ ui.transportDispoTable.filters.Terminal_Inland_CTV ?? "" }}';
DECLARE @ETD_Pickup_PortOfDischarge NVARCHAR(255) = '{{ ui.ontable.filters.ETD_Pickup_PortOfDischarge ?? "" }}';
DECLARE @ATD_Pickup_PortOfDischarge NVARCHAR(255) = '{{ ui.ontable.filters.ATD_Pickup_PortOfDischarge ?? "" }}';
DECLARE @pinRequested NVARCHAR(255) = '{{ ui.ontable.filters.pinRequested ?? "" }}';
DECLARE @pinState NVARCHAR(255) = '{{ ui.ontable.filters.pinState ?? "" }}';
DECLARE @nationalTransportState NVARCHAR(255) = '{{ ui.ontable.filters.nationalTransportState ?? "" }}';
DECLARE @finalDeliveryState NVARCHAR(255) = '{{ ui.ontable.filters.finalDeliveryState ?? "" }}';
DECLARE @emptyReturnState NVARCHAR(255) = '{{ ui.ontable.filters.emptyReturnState ?? "" }}';
DECLARE @ETA_Terminal_Inland_Vorgabe_NTL NVARCHAR(255) = '{{ ui.ontable.filters.ETA_Terminal_Inland_Vorgabe_NTL ?? "" }}';
DECLARE @DeliveryInfo_send_to_CTV NVARCHAR(255) = '{{ ui.ontable.filters.DeliveryInfo_send_to_CTV ?? "" }}';
DECLARE @new NVARCHAR(255) = '{{ ui.ontable.filters.new ?? "" }}';
DECLARE @Transport_Mode_Terminal_Vorgabe_NTL NVARCHAR(255) = '{{ ui.ontable.filters.Transport_Mode_Terminal_Vorgabe_NTL ?? "" }}';
DECLARE @Terminal_Inland_CundA NVARCHAR(255) = '{{ ui.ontable.filters.Terminal_Inland_CundA ?? "" }}';
DECLARE @Direct_Truck NVARCHAR(255) = '{{ ui.ontable.filters.Direct_Truck ?? "" }}';
DECLARE @eventType NVARCHAR(255) = '{{ ui.ontable.filters.eventType ?? "" }}';
DECLARE @Transport_To_Terminal NVARCHAR(255) = '{{ ui.ontable.filters.Transport_To_Terminal ?? "" }}';
DECLARE @Transport_Document_Number NVARCHAR(255) = '{{ ui.ontable.filters.Transport_Document_Number ?? "" }}';
DECLARE @Seal_Number NVARCHAR(255) = '{{ ui.ontable.filters.Seal_Number ?? "" }}';
DECLARE @ETA_DeliveryAddress_CTV NVARCHAR(255) = '{{ ui.ontable.filters.ETA_DeliveryAddress_CTV ?? "" }}';
DECLARE @Cancelation_Send_To_CTV NVARCHAR(255) = '{{ ui.ontable.filters.Cancelation_Send_To_CTV ?? "" }}';
DECLARE @TAC NVARCHAR(255) = '{{ ui.ontable.filters.TAC ?? "" }}';
DECLARE @ETA_Delivery_Address_Update_TimeStamp NVARCHAR(255) = '{{ ui.ontable.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }}';

-- Main query with filtering, sorting, and pagination
SELECT 
    d.*,
    tm.Wert AS MBL_No,
    tm2.Wert AS Container_No,
    (
        SELECT COUNT(*)
        FROM transport_messages msg
        WHERE msg.Transport_Dispo_ID = d.Transport_Dispo_ID
    ) AS error_count
FROM dbo.transport_UI as d
JOIN dbo.Transport_Mapping tm
    ON tm.Schluessel = d.MBL_ID AND tm.Typ = 'M'
JOIN dbo.Transport_Mapping tm2
    ON tm2.Schluessel = d.ContainerID AND tm2.Typ = 'C'
WHERE
    (@CustomerID = '' OR d.CustomerID LIKE CONCAT('%', @CustomerID, '%'))
    AND (@MBL_ID = '' OR d.MBL_ID LIKE CONCAT('%', @MBL_ID, '%'))
    AND (@ContainerID = '' OR d.ContainerID LIKE CONCAT('%', @ContainerID, '%'))
    AND (@Status = '' OR d.Status LIKE CONCAT('%', @Status, '%'))
    AND (@TransmissionTimestamp = '' OR d.TransmissionTimestamp LIKE CONCAT('%', @TransmissionTimestamp, '%'))
    AND (@Voyage = '' OR d.Voyage LIKE CONCAT('%', @Voyage, '%'))
    AND (@ContainerSize = '' OR d.ContainerSize LIKE CONCAT('%', @ContainerSize, '%'))
    AND (@Broker = '' OR d.Broker LIKE CONCAT('%', @Broker, '%'))
    AND (@Carrier = '' OR d.Carrier LIKE CONCAT('%', @Carrier, '%'))
    AND (@Vessel = '' OR d.Vessel LIKE CONCAT('%', @Vessel, '%'))
    AND (@PortOfDischarge_Lima = '' OR d.PortOfDischarge_Lima LIKE CONCAT('%', @PortOfDischarge_Lima, '%'))
    AND (@ETA_PortOfDischarge = '' OR d.ETA_PortOfDischarge LIKE CONCAT('%', @ETA_PortOfDischarge, '%'))
    AND (@PackingMethod = '' OR d.PackingMethod LIKE CONCAT('%', @PackingMethod, '%'))
    AND (@TotalWeight = '' OR d.TotalWeight LIKE CONCAT('%', @TotalWeight, '%'))
    AND (@AdvertFlag = '' OR d.AdvertFlag LIKE CONCAT('%', @AdvertFlag, '%'))
    AND (@RealAdvertFlag = '' OR d.RealAdvertFlag LIKE CONCAT('%', @RealAdvertFlag, '%'))
    AND (@EarliestAdvertDate = '' OR d.EarliestAdvertDate LIKE CONCAT('%', @EarliestAdvertDate, '%'))
    AND (@EarliestRealAdvertDate = '' OR d.EarliestRealAdvertDate LIKE CONCAT('%', @EarliestRealAdvertDate, '%'))
    AND (@todo = '' OR d.todo LIKE CONCAT('%', @todo, '%'))
    AND (@last_eventID = '' OR d.last_eventID LIKE CONCAT('%', @last_eventID, '%'))
    AND (@PortOfLoading_Lima = '' OR d.PortOfLoading_Lima LIKE CONCAT('%', @PortOfLoading_Lima, '%'))
    AND (@ETD_PortOfLoading = '' OR d.ETD_PortOfLoading LIKE CONCAT('%', @ETD_PortOfLoading, '%'))
    AND (@Terminal_Inland_Vorgabe_NTL = '' OR d.Terminal_Inland_Vorgabe_NTL LIKE CONCAT('%', @Terminal_Inland_Vorgabe_NTL, '%'))
    AND (@ETA_Terminal_Inland = '' OR d.ETA_Terminal_Inland LIKE CONCAT('%', @ETA_Terminal_Inland, '%'))
    AND (@DeliveryAddress = '' OR d.DeliveryAddress LIKE CONCAT('%', @DeliveryAddress, '%'))
    AND (@ETA_DeliveryAddress = '' OR d.ETA_DeliveryAddress LIKE CONCAT('%', @ETA_DeliveryAddress, '%'))
    AND (@Transport_Mode_Terminal = '' OR d.Transport_Mode_Terminal LIKE CONCAT('%', @Transport_Mode_Terminal, '%'))
    AND (@Transport_Mode_final_DeliveryAddress = '' OR d.Transport_Mode_final_DeliveryAddress LIKE CONCAT('%', @Transport_Mode_final_DeliveryAddress, '%'))
    AND (@ATA_DeliveryAddress = '' OR d.ATA_DeliveryAddress LIKE CONCAT('%', @ATA_DeliveryAddress, '%'))
    AND (@transport_Dispo_ID = '' OR d.transport_Dispo_ID LIKE CONCAT('%', @transport_Dispo_ID, '%'))
    AND (@Condition = '' OR d.Condition LIKE CONCAT('%', @Condition, '%'))
    AND (@into_CW1 = '' OR d.into_CW1 LIKE CONCAT('%', @into_CW1, '%'))
    AND (@to_Customer = '' OR d.to_Customer LIKE CONCAT('%', @to_Customer, '%'))
    AND (@to_Transporter = '' OR d.to_Transporter LIKE CONCAT('%', @to_Transporter, '%'))
    AND (@DropOff_Terminal = '' OR d.DropOff_Terminal LIKE CONCAT('%', @DropOff_Terminal, '%'))
    AND (@Terminal_PortOfDischarge = '' OR d.Terminal_PortOfDischarge LIKE CONCAT('%', @Terminal_PortOfDischarge, '%'))
    AND (@Pincode = '' OR d.Pincode LIKE CONCAT('%', @Pincode, '%'))
    AND (@DropOff_Terminal_TIR = '' OR d.DropOff_Terminal_TIR LIKE CONCAT('%', @DropOff_Terminal_TIR, '%'))
    AND (@Delivered = '' OR d.Delivered LIKE CONCAT('%', @Delivered, '%'))
    AND (@Remarks = '' OR d.Remarks LIKE CONCAT('%', @Remarks, '%'))
    AND (@HouseBill = '' OR d.HouseBill LIKE CONCAT('%', @HouseBill, '%'))
    AND (@Containerverfuegbarkeit = '' OR d.Containerverfuegbarkeit LIKE CONCAT('%', @Containerverfuegbarkeit, '%'))
    AND (@ETA_Service_Provider = '' OR d.ETA_Service_Provider LIKE CONCAT('%', @ETA_Service_Provider, '%'))
    AND (@ATA_Terminal_Inland = '' OR d.ATA_Terminal_Inland LIKE CONCAT('%', @ATA_Terminal_Inland, '%'))
    AND (@ATD_Terminal_Inland = '' OR d.ATD_Terminal_Inland LIKE CONCAT('%', @ATD_Terminal_Inland, '%'))
    AND (@Return_Date_to_Depot = '' OR d.Return_Date_to_Depot LIKE CONCAT('%', @Return_Date_to_Depot, '%'))
    AND (@ATD_Seaport = '' OR d.ATD_Seaport LIKE CONCAT('%', @ATD_Seaport, '%'))
    AND (@ETD_Seaport = '' OR d.ETD_Seaport LIKE CONCAT('%', @ETD_Seaport, '%'))
    AND (@ETA_Seaport = '' OR d.ETA_Seaport LIKE CONCAT('%', @ETA_Seaport, '%'))
    AND (@ATA_Seaport = '' OR d.ATA_Seaport LIKE CONCAT('%', @ATA_Seaport, '%'))
    AND (@final_date_delivery_address = '' OR d.final_date_delivery_address LIKE CONCAT('%', @final_date_delivery_address, '%'))
    AND (@ctv_booking_id = '' OR d.ctv_booking_id LIKE CONCAT('%', @ctv_booking_id, '%'))
    AND (@CTV_ETA_PortOfDischarge = '' OR d.CTV_ETA_PortOfDischarge LIKE CONCAT('%', @CTV_ETA_PortOfDischarge, '%'))
    AND (@PortOfDischarge_UNLOCO = '' OR d.PortOfDischarge_UNLOCO LIKE CONCAT('%', @PortOfDischarge_UNLOCO, '%'))
    AND (@PortOfLoading_UNLOCO = '' OR d.PortOfLoading_UNLOCO LIKE CONCAT('%', @PortOfLoading_UNLOCO, '%'))
    AND (@ATA_DropOff_Terminal = '' OR d.ATA_DropOff_Terminal LIKE CONCAT('%', @ATA_DropOff_Terminal, '%'))
    AND (@DeliveryAddress_CTV = '' OR d.DeliveryAddress_CTV LIKE CONCAT('%', @DeliveryAddress_CTV, '%'))
    AND (@PortOfDischarge_UNLOCO_CTV = '' OR d.PortOfDischarge_UNLOCO_CTV LIKE CONCAT('%', @PortOfDischarge_UNLOCO_CTV, '%'))
    AND (@Transport_Mode_Terminal_CTV = '' OR d.Transport_Mode_Terminal_CTV LIKE CONCAT('%', @Transport_Mode_Terminal_CTV, '%'))
    AND (@Carrier_CTV = '' OR d.Carrier_CTV LIKE CONCAT('%', @Carrier_CTV, '%'))
    AND (@customs_document_number = '' OR d.customs_document_number LIKE CONCAT('%', @customs_document_number, '%'))
    AND (@customs_document_type = '' OR d.customs_document_type LIKE CONCAT('%', @customs_document_type, '%'))
    AND (@Terminal_Inland_CTV = '' OR d.Terminal_Inland_CTV LIKE CONCAT('%', @Terminal_Inland_CTV, '%'))
    AND (@ETD_Pickup_PortOfDischarge = '' OR d.ETD_Pickup_PortOfDischarge LIKE CONCAT('%', @ETD_Pickup_PortOfDischarge, '%'))
    AND (@ATD_Pickup_PortOfDischarge = '' OR d.ATD_Pickup_PortOfDischarge LIKE CONCAT('%', @ATD_Pickup_PortOfDischarge, '%'))
    AND (@pinRequested = '' OR d.pinRequested LIKE CONCAT('%', @pinRequested, '%'))
    AND (@pinState = '' OR d.pinState LIKE CONCAT('%', @pinState, '%'))
    AND (@nationalTransportState = '' OR d.nationalTransportState LIKE CONCAT('%', @nationalTransportState, '%'))
    AND (@finalDeliveryState = '' OR d.finalDeliveryState LIKE CONCAT('%', @finalDeliveryState, '%'))
    AND (@emptyReturnState = '' OR d.emptyReturnState LIKE CONCAT('%', @emptyReturnState, '%'))
    AND (@ETA_Terminal_Inland_Vorgabe_NTL = '' OR d.ETA_Terminal_Inland_Vorgabe_NTL LIKE CONCAT('%', @ETA_Terminal_Inland_Vorgabe_NTL, '%'))
    AND (@DeliveryInfo_send_to_CTV = '' OR d.DeliveryInfo_send_to_CTV LIKE CONCAT('%', @DeliveryInfo_send_to_CTV, '%'))
    AND (@new = '' OR d.new LIKE CONCAT('%', @new, '%'))
    AND (@Transport_Mode_Terminal_Vorgabe_NTL = '' OR d.Transport_Mode_Terminal_Vorgabe_NTL LIKE CONCAT('%', @Transport_Mode_Terminal_Vorgabe_NTL, '%'))
    AND (@Terminal_Inland_CundA = '' OR d.Terminal_Inland_CundA LIKE CONCAT('%', @Terminal_Inland_CundA, '%'))
    AND (@Direct_Truck = '' OR d.Direct_Truck LIKE CONCAT('%', @Direct_Truck, '%'))
    AND (@eventType = '' OR d.eventType LIKE CONCAT('%', @eventType, '%'))
    AND (@Transport_To_Terminal = '' OR d.Transport_To_Terminal LIKE CONCAT('%', @Transport_To_Terminal, '%'))
    AND (@Transport_Document_Number = '' OR d.Transport_Document_Number LIKE CONCAT('%', @Transport_Document_Number, '%'))
    AND (@Seal_Number = '' OR d.Seal_Number LIKE CONCAT('%', @Seal_Number, '%'))
    AND (@ETA_DeliveryAddress_CTV = '' OR d.ETA_DeliveryAddress_CTV LIKE CONCAT('%', @ETA_DeliveryAddress_CTV, '%'))
    AND (@Cancelation_Send_To_CTV = '' OR d.Cancelation_Send_To_CTV LIKE CONCAT('%', @Cancelation_Send_To_CTV, '%'))
    AND (@TAC = '' OR d.TAC LIKE CONCAT('%', @TAC, '%'))
    AND (@ETA_Delivery_Address_Update_TimeStamp = '' OR d.ETA_Delivery_Address_Update_TimeStamp LIKE CONCAT('%', @ETA_Delivery_Address_Update_TimeStamp, '%'))
ORDER BY
   
    CASE 
        WHEN @SortColumn = 'MBL_No' AND @SortDirection = 'ASC' THEN tm.Wert
    END ASC,
    CASE 
        WHEN @SortColumn = 'MBL_No' AND @SortDirection = 'DESC' THEN tm.Wert
    END DESC,
    CASE 
        WHEN @SortColumn = 'Container_No' AND @SortDirection = 'ASC' THEN tm2.Wert
    END ASC,
    CASE 
        WHEN @SortColumn = 'Container_No' AND @SortDirection = 'DESC' THEN tm2.Wert
    END DESC,
    CASE 
        WHEN @SortColumn = 'Status' AND @SortDirection = 'ASC' THEN d.Status
    END ASC,
    CASE 
        WHEN @SortColumn = 'Status' AND @SortDirection = 'DESC' THEN d.Status
    END DESC,
    -- Add more sort cases as needed for other columns
    tm.Wert ASC -- Default sort
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;