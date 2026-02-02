-- Pagination Variables
DECLARE @PageNumber INT = {{ui.ontable.paginationOffset}} / {{ui.ontable.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable.pageSize}};
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
   (TransmissionTimestamp LIKE '%' + {{ ui.ontable.filters.TransmissionTimestamp ?? "" }} + '%' OR {{ ui.ontable.filters.TransmissionTimestamp ?? "" }} = '')
    AND (Voyage LIKE '%' + {{ ui.ontable.filters.Voyage ?? "" }} + '%' OR {{ ui.ontable.filters.Voyage ?? "" }} = '')
    AND (ContainerSize LIKE '%' + {{ ui.ontable.filters.ContainerSize ?? "" }} + '%' OR {{ ui.ontable.filters.ContainerSize ?? "" }} = '')
    AND (Carrier LIKE '%' + {{ ui.ontable.filters.Carrier ?? "" }} + '%' OR {{ ui.ontable.filters.Carrier ?? "" }} = '')
    AND (Vessel LIKE '%' + {{ ui.ontable.filters.Vessel ?? "" }} + '%' OR {{ ui.ontable.filters.Vessel ?? "" }} = '')
    AND (PackingMethod LIKE '%' + {{ ui.ontable.filters.PackingMethod ?? "" }} + '%' OR {{ ui.ontable.filters.PackingMethod ?? "" }} = '')
    AND (TotalWeight LIKE '%' + {{ ui.ontable.filters.TotalWeight ?? "" }} + '%' OR {{ ui.ontable.filters.TotalWeight ?? "" }} = '')
    AND (AdvertFlag LIKE '%' + {{ ui.ontable.filters.AdvertFlag ?? "" }} + '%' OR {{ ui.ontable.filters.AdvertFlag ?? "" }} = '')
    AND (RealAdvertFlag LIKE '%' + {{ ui.ontable.filters.RealAdvertFlag ?? "" }} + '%' OR {{ ui.ontable.filters.RealAdvertFlag ?? "" }} = '')
    AND (ETA_Delivery_Address_Update_TimeStamp LIKE '%' + {{ ui.ontable.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} + '%' OR {{ ui.ontable.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} = '')
    
ORDER BY d.MBL_ID
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
