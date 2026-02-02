const payload = steps.buildPayload.data || [];

for (const row of payload) {
  await ui.db.run(
    `IF EXISTS (SELECT 1 FROM dbo.Transport_Dispo_clone WHERE CustomerID=@CustomerID AND MBL_ID=@MBL_ID AND ContainerID=@ContainerID)
     BEGIN
       UPDATE dbo.Transport_Dispo_clone
       SET transport_Dispo_ID=@transport_Dispo_ID,
           Pincode=@Pincode
       WHERE CustomerID=@CustomerID AND MBL_ID=@MBL_ID AND ContainerID=@ContainerID;
     END
     ELSE
     BEGIN
       INSERT INTO dbo.Transport_Dispo_clone(CustomerID, MBL_ID, ContainerID, transport_Dispo_ID, Pincode)
       VALUES(@CustomerID, @MBL_ID, @ContainerID, @transport_Dispo_ID, @Pincode);
     END`,
    {
      CustomerID: row.CustomerID,
      MBL_ID: row.MBL_ID,
      ContainerID: row.ContainerID,
      transport_Dispo_ID: row.transport_Dispo_ID,
      Pincode: row.Pincode
    }
  );
}
