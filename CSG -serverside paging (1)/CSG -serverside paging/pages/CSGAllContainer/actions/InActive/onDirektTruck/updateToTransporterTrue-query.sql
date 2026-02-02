UPDATE dbo.Transport_Dispo
SET 
to_Transporter = {{ui.ontable.clickedRow.data.to_Transporter = 1}}
WHERE Transport_Dispo_ID = {{ ui.ontable.selectedRow.data.transport_Dispo_ID }};

