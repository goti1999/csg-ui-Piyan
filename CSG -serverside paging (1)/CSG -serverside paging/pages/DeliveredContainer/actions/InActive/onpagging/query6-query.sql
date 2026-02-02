-- Pagination Variables
DECLARE @PageNumber INT = {{ui.ontable13.paginationOffset}} / {{ui.ontable13.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable13.pageSize}};
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
   (TransmissionTimestamp LIKE '%' + {{ ui.ontable13.filters.TransmissionTimestamp ?? "" }} + '%' OR {{ ui.ontable13.filters.TransmissionTimestamp ?? "" }} = '')
    AND (Voyage LIKE '%' + {{ ui.ontable13.filters.Voyage ?? "" }} + '%' OR {{ ui.ontable13.filters.Voyage ?? "" }} = '')
    AND (ContainerSize LIKE '%' + {{ ui.ontable13.filters.ContainerSize ?? "" }} + '%' OR {{ ui.ontable13.filters.ContainerSize ?? "" }} = '')
    AND (Carrier LIKE '%' + {{ ui.ontable13.filters.Carrier ?? "" }} + '%' OR {{ ui.ontable13.filters.Carrier ?? "" }} = '')
    AND (Vessel LIKE '%' + {{ ui.ontable13.filters.Vessel ?? "" }} + '%' OR {{ ui.ontable13.filters.Vessel ?? "" }} = '')
    AND (PackingMethod LIKE '%' + {{ ui.ontable13.filters.PackingMethod ?? "" }} + '%' OR {{ ui.ontable13.filters.PackingMethod ?? "" }} = '')
    AND (TotalWeight LIKE '%' + {{ ui.ontable13.filters.TotalWeight ?? "" }} + '%' OR {{ ui.ontable13.filters.TotalWeight ?? "" }} = '')
    AND (AdvertFlag LIKE '%' + {{ ui.ontable13.filters.AdvertFlag ?? "" }} + '%' OR {{ ui.ontable13.filters.AdvertFlag ?? "" }} = '')
    AND (RealAdvertFlag LIKE '%' + {{ ui.ontable13.filters.RealAdvertFlag ?? "" }} + '%' OR {{ ui.ontable13.filters.RealAdvertFlag ?? "" }} = '')
    AND (ETA_Delivery_Address_Update_TimeStamp LIKE '%' + {{ ui.ontable13.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} + '%' OR {{ ui.ontable13.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} = '')
    
ORDER BY d.MBL_ID
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
