UPDATE dbo.Transport_Dispo
SET 
to_Transporter = {{ui.ontable13.clickedRow.data.to_Transporter = 1}}
WHERE Transport_Dispo_ID = {{ ui.ontable13.selectedRow.data.transport_Dispo_ID }};

