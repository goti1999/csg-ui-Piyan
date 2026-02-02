-- Pagination Variables
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
   (TransmissionTimestamp LIKE '%' + ? + '%' OR ? = '')
    AND (Voyage LIKE '%' + ? + '%' OR ? = '')
    AND (ContainerSize LIKE '%' + ? + '%' OR ? = '')
    AND (Carrier LIKE '%' + ? + '%' OR ? = '')
    AND (Vessel LIKE '%' + ? + '%' OR ? = '')
    AND (PackingMethod LIKE '%' + ? + '%' OR ? = '')
    AND (TotalWeight LIKE '%' + ? + '%' OR ? = '')
    AND (AdvertFlag LIKE '%' + ? + '%' OR ? = '')
    AND (RealAdvertFlag LIKE '%' + ? + '%' OR ? = '')
    AND (ETA_Delivery_Address_Update_TimeStamp LIKE '%' + ? + '%' OR ? = '')
    
ORDER BY d.MBL_ID
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
