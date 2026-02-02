INSERT INTO dbo.Transport_Dispo_clone (LogPayload)
VALUES (
{{steps.getAuditPayload.data}}
);