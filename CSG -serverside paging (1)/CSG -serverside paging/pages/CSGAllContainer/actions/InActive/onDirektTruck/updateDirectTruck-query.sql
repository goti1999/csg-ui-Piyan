UPDATE dbo.Transport_Dispo_clone 
SET

  Direct_Truck = {{ ui.form.value.Direct_Truck }}
  
WHERE Transport_Dispo_ID = {{ ui.form.value.transport_Dispo_ID }};
