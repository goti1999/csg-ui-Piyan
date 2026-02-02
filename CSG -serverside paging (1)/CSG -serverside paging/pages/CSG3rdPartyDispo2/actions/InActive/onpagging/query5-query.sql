DECLARE @PageNumber INT = {{ui.ontable5.paginationOffset}} / {{ui.ontable5.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable5.pageSize}};
DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

-- Main Query with Pagination
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

    (d.State LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.State ?? ""}}', ''), '') + '%' 
     OR '{{ui.ontable5.filters.State ?? ""}}' = '')
    
    AND (d.Status_Dispo LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Status_Dispo ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Status_Dispo ?? ""}}' = '')
   
    AND (d.Status_Transport LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Status_Transport ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Status_Transport ?? ""}}' = '')
    
    AND (d.Condition LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Condition ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Condition ?? ""}}' = '')
   
    AND (tm.Wert LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.MBL_No ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.MBL_No ?? ""}}' = '')
e)
    AND (tm2.Wert LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Container_No ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Container_No ?? ""}}' = '')
 
    AND (CONVERT(VARCHAR, d.TransmissionTimestamp, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.TransmissionTimestamp ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.TransmissionTimestamp ?? ""}}' = '')
   
    AND (d.ContainerSize LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.ContainerSize ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.ContainerSize ?? ""}}' = '')
 
    AND (d.Carrier LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Carrier ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Carrier ?? ""}}' = '')
    
    AND (d.Vessel LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Vessel ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Vessel ?? ""}}' = '')

    AND (d.Voyage LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Voyage ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Voyage ?? ""}}' = '')
   
    AND (d.PackingMethod LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.PackingMethod ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.PackingMethod ?? ""}}' = '')
   
    AND (CONVERT(VARCHAR, d.TotalWeight) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.TotalWeight ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.TotalWeight ?? ""}}' = '')

    AND (d.AdvertFlag LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.AdvertFlag ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.AdvertFlag ?? ""}}' = '')

    AND (d.RealAdvertFlag LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.RealAdvertFlag ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.RealAdvertFlag ?? ""}}' = '')

    AND (CONVERT(VARCHAR, d.EarliestAdvertDate, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.EarliestAdvertDate ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.EarliestAdvertDate ?? ""}}' = '')
 
    AND (CONVERT(VARCHAR, d.ETA_PortOfDischarge, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.ETA_PortOfDischarge ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.ETA_PortOfDischarge ?? ""}}' = '')

    AND (d.Broker LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Broker ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Broker ?? ""}}' = '')
  
    AND (d.DirektTruck LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.DirektTruck ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.DirektTruck ?? ""}}' = '')

    AND (CONVERT(VARCHAR, d.ATA_Seaport, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.ATA_Seaport ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.ATA_Seaport ?? ""}}' = '')

    AND (d.PortOfDischarge LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.PortOfDischarge ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.PortOfDischarge ?? ""}}' = '')
 
    AND (d.Terminal_PortOfDischarge LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Terminal_PortOfDischarge ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Terminal_PortOfDischarge ?? ""}}' = '')
    
    -- ETA Terminal Inland filter
    AND (CONVERT(VARCHAR, d.ETA_Terminal_Inland, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.ETA_Terminal_Inland ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.ETA_Terminal_Inland ?? ""}}' = '')
    
    -- ATA Terminal Inland filter
    AND (CONVERT(VARCHAR, d.ATA_Terminal_Inland, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.ATA_Terminal_Inland ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.ATA_Terminal_Inland ?? ""}}' = '')
    
    -- ETA Delivery Address filter
    AND (CONVERT(VARCHAR, d.ETA_DeliveryAddress, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.ETA_DeliveryAddress ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.ETA_DeliveryAddress ?? ""}}' = '')
    
    -- ATA Delivery Address filter
    AND (CONVERT(VARCHAR, d.ATA_DeliveryAddress, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.ATA_DeliveryAddress ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.ATA_DeliveryAddress ?? ""}}' = '')
    
    -- Terminal Inland Vorgabe NTL filter
    AND (d.Terminal_Inland_Vorgabe_NTL LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Terminal_Inland_Vorgabe_NTL ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Terminal_Inland_Vorgabe_NTL ?? ""}}' = '')
    
    -- Delivery Address filter
    AND (d.DeliveryAddress LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.DeliveryAddress ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.DeliveryAddress ?? ""}}' = '')
    
    -- Drop Off Terminal filter
    AND (d.DropOffTerminal LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.DropOffTerminal ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.DropOffTerminal ?? ""}}' = '')
    
    -- DropOff Terminal TIR filter
    AND (d.DropOffTerminal_TIR LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.DropOffTerminal_TIR ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.DropOffTerminal_TIR ?? ""}}' = '')
    
    -- ATA DropOff Terminal filter
    AND (CONVERT(VARCHAR, d.ATA_DropOffTerminal, 120) LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.ATA_DropOffTerminal ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.ATA_DropOffTerminal ?? ""}}' = '')
    
    -- Delivered filter
    AND (d.Delivered LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Delivered ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Delivered ?? ""}}' = '')
    
    -- Transport Mode Final Delivery Address filter
    AND (d.TransportMode_FinalDeliveryAddress LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.TransportMode_FinalDeliveryAddress ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.TransportMode_FinalDeliveryAddress ?? ""}}' = '')
    
    -- Transport Mode Terminal filter
    AND (d.TransportMode_Terminal LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.TransportMode_Terminal ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.TransportMode_Terminal ?? ""}}' = '')
    
    -- Terminal Inland CundA filter
    AND (d.Terminal_Inland_CundA LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Terminal_Inland_CundA ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Terminal_Inland_CundA ?? ""}}' = '')
    
    -- Terminal Inland CTV filter
    AND (d.Terminal_Inland_CTV LIKE '%' + ISNULL(NULLIF('{{ui.ontable5.filters.Terminal_Inland_CTV ?? ""}}', ''), '') + '%' 
         OR '{{ui.ontable5.filters.Terminal_Inland_CTV ?? ""}}' = '')

-- Sorting
ORDER BY d.MBL_ID

OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;