IF EXISTS (
    SELECT 1 
    FROM dbo.Transport_Dispo
    WHERE Transport_Dispo_ID = {{ ui.ontable10.selectedRow.data.transport_Dispo_ID }}
)
BEGIN
    UPDATE dbo.Transport_Dispo
    SET
        to_Customer = {{ ui.ontable10.selectedRow.data.to_Customer }},
        to_Transporter = {{ ui.ontable10.selectedRow.data.to_Transporter }}
    WHERE Transport_Dispo_ID = {{ ui.ontable10.selectedRow.data.transport_Dispo_ID }};
END
ELSE
BEGIN
    INSERT INTO dbo.Transport_Dispo (
        Transport_Dispo_ID,
        to_Customer,
        to_Transporter
    )
    VALUES (
        {{ ui.ontable10.selectedRow.data.transport_Dispo_ID }},
        {{ ui.ontable10.selectedRow.data.to_Customer }},
        {{ ui.ontable10.selectedRow.data.to_Transporter }}
    );
END
