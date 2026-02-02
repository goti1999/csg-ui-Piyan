DECLARE @PageNumber INT = ? / ? + 1;
DECLARE @PageSize INT = ?;
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

    (d.State LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
     OR '?' = '')
    
    AND (d.Status_Dispo LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
   
    AND (d.Status_Transport LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    AND (d.Condition LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
   
    AND (tm.Wert LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
e)
    AND (tm2.Wert LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
 
    AND (CONVERT(VARCHAR, d.TransmissionTimestamp, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
   
    AND (d.ContainerSize LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
 
    AND (d.Carrier LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    AND (d.Vessel LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')

    AND (d.Voyage LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
   
    AND (d.PackingMethod LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
   
    AND (CONVERT(VARCHAR, d.TotalWeight) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')

    AND (d.AdvertFlag LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')

    AND (d.RealAdvertFlag LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')

    AND (CONVERT(VARCHAR, d.EarliestAdvertDate, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
 
    AND (CONVERT(VARCHAR, d.ETA_PortOfDischarge, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')

    AND (d.Broker LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
  
    AND (d.DirektTruck LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')

    AND (CONVERT(VARCHAR, d.ATA_Seaport, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')

    AND (d.PortOfDischarge LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
 
    AND (d.Terminal_PortOfDischarge LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- ETA Terminal Inland filter
    AND (CONVERT(VARCHAR, d.ETA_Terminal_Inland, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- ATA Terminal Inland filter
    AND (CONVERT(VARCHAR, d.ATA_Terminal_Inland, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- ETA Delivery Address filter
    AND (CONVERT(VARCHAR, d.ETA_DeliveryAddress, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- ATA Delivery Address filter
    AND (CONVERT(VARCHAR, d.ATA_DeliveryAddress, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- Terminal Inland Vorgabe NTL filter
    AND (d.Terminal_Inland_Vorgabe_NTL LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- Delivery Address filter
    AND (d.DeliveryAddress LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- Drop Off Terminal filter
    AND (d.DropOffTerminal LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- DropOff Terminal TIR filter
    AND (d.DropOffTerminal_TIR LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- ATA DropOff Terminal filter
    AND (CONVERT(VARCHAR, d.ATA_DropOffTerminal, 120) LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- Delivered filter
    AND (d.Delivered LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- Transport Mode Final Delivery Address filter
    AND (d.TransportMode_FinalDeliveryAddress LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- Transport Mode Terminal filter
    AND (d.TransportMode_Terminal LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- Terminal Inland CundA filter
    AND (d.Terminal_Inland_CundA LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')
    
    -- Terminal Inland CTV filter
    AND (d.Terminal_Inland_CTV LIKE '%' + ISNULL(NULLIF('?', ''), '') + '%' 
         OR '?' = '')

-- Sorting
ORDER BY d.MBL_ID

OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;