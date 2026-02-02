UPDATE dbo.Transport_Dispo
SET to_Customer = {{ ui.todopopup12.value.to_Customer }}
WHERE to_Customer = {{ ui.todopopup12.value.to_Customer }};
