-- Pagination Variables
DECLARE @PageNumber INT = {{ui.ontable9.paginationOffset}} / {{ui.ontable9.pageSize}} + 1;
DECLARE @PageSize INT = {{ui.ontable9.pageSize}};
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
   (TransmissionTimestamp LIKE '%' + {{ ui.ontable9.filters.TransmissionTimestamp ?? "" }} + '%' OR {{ ui.ontable9.filters.TransmissionTimestamp ?? "" }} = '')
    AND (Voyage LIKE '%' + {{ ui.ontable9.filters.Voyage ?? "" }} + '%' OR {{ ui.ontable9.filters.Voyage ?? "" }} = '')
    AND (ContainerSize LIKE '%' + {{ ui.ontable9.filters.ContainerSize ?? "" }} + '%' OR {{ ui.ontable9.filters.ContainerSize ?? "" }} = '')
    AND (Carrier LIKE '%' + {{ ui.ontable9.filters.Carrier ?? "" }} + '%' OR {{ ui.ontable9.filters.Carrier ?? "" }} = '')
    AND (Vessel LIKE '%' + {{ ui.ontable9.filters.Vessel ?? "" }} + '%' OR {{ ui.ontable9.filters.Vessel ?? "" }} = '')
    AND (PackingMethod LIKE '%' + {{ ui.ontable9.filters.PackingMethod ?? "" }} + '%' OR {{ ui.ontable9.filters.PackingMethod ?? "" }} = '')
    AND (TotalWeight LIKE '%' + {{ ui.ontable9.filters.TotalWeight ?? "" }} + '%' OR {{ ui.ontable9.filters.TotalWeight ?? "" }} = '')
    AND (AdvertFlag LIKE '%' + {{ ui.ontable9.filters.AdvertFlag ?? "" }} + '%' OR {{ ui.ontable9.filters.AdvertFlag ?? "" }} = '')
    AND (RealAdvertFlag LIKE '%' + {{ ui.ontable9.filters.RealAdvertFlag ?? "" }} + '%' OR {{ ui.ontable9.filters.RealAdvertFlag ?? "" }} = '')
    AND (ETA_Delivery_Address_Update_TimeStamp LIKE '%' + {{ ui.ontable9.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} + '%' OR {{ ui.ontable9.filters.ETA_Delivery_Address_Update_TimeStamp ?? "" }} = '')
    
ORDER BY d.MBL_ID
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
