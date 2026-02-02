UPDATE dbo.Transport_Dispo_clone 
SET

  Direct_Truck = {{ ui.form13.value.Direct_Truck }}
  
WHERE Transport_Dispo_ID = {{ ui.form13.value.transport_Dispo_ID }};
