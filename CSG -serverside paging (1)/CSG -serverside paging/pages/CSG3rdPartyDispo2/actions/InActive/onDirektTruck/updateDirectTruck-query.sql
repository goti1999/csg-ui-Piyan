UPDATE dbo.Transport_Dispo_clone 
SET

  Direct_Truck = {{ ui.form4.value.Direct_Truck }}
  
WHERE Transport_Dispo_ID = {{ ui.form4.value.transport_Dispo_ID }};
