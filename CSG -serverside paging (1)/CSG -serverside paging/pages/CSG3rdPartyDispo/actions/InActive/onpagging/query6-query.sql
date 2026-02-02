-- Pagination Variables
DECLARE @PageNumber INT = {{ui.ontable11.paginationOffset}} / {{ui.ontable11.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable11.pageSize}};
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
   (TransmissionTimestamp LIKE '%' + {{ ui.ontable11.filters.TransmissionTimestamp ?? "" }} + '%' OR {{ ui.ontable11.filters.TransmissionTimestamp ?? "" }} = '')
    AND (Voyage LIKE '%' + {{ ui.ontable11.filters.Voyage ?? "" }} + '%' OR {{ ui.ontable11.filters.Voyage ?? "" }} = '')
    AND (ContainerSize LIKE '%' + {{ ui.ontable11.filters.ContainerSize ?? "" }} + '%' OR {{ ui.ontable11.filters.ContainerSize ?? "" }} = '')
    AND (Carrier LIKE '%' + {{ ui.ontable11.filters.Carrier ?? "" }} + '%' OR {{ ui.ontable11.filters.Carrier ?? "" }} = '')
    AND (Vessel LIKE '%' + {{ ui.ontable11.filters.Vessel ?? "" }} + '%' OR {{ ui.ontable11.filters.Vessel ?? "" }} = '')
    AND (PackingMethod LIKE '%' + {{ ui.ontable11.filters.PackingMethod ?? "" }} + '%' OR {{ ui.ontable11.filters.PackingMethod ?? "" }} = '')
    AND (TotalWeight LIKE '%' + {{ ui.ontable11.filters.TotalWeight ?? "" }} + '%' OR {{ ui.ontable11.filters.TotalWeight ?? "" }} = '')
    AND (AdvertFlag LIKE '%' + {{ ui.ontable11.filters.AdvertFlag ?? "" }} + '%' OR {{ ui.ontable11.filters.AdvertFlag ?? "" }} = '')
    AND (RealAdvertFlag LIKE '%' + {{ ui.ontable11.filters.RealAdvertFlag ?? "" }} + '%' OR {{ ui.ontable11.filters.RealAdvertFlag ?? "" }} = '')
    AND (ETA_Delivery_Address_Update_TimeStamp LIKE '%' + {{ ui.ontable11.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} + '%' OR {{ ui.ontable11.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} = '')
    
ORDER BY d.MBL_ID
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
