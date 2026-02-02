IF EXISTS (
    SELECT 1 
    FROM dbo.transport_dispo 
    WHERE Transport_Dispo_ID = {{ ui.todopopup4.value.transport_Dispo_ID }}
)
BEGIN
    UPDATE dbo.transport_dispo
    SET
        to_Customer = CASE 
            WHEN {{ ui.todopopup4.value.to_Customer }} = 'true' THEN 1
            WHEN {{ ui.todopopup4.value.to_Customer }} = 'false' THEN 0
            ELSE {{ ui.todopopup4.value.to_Customer }} -- fallback if already 1 or 0
        END
    WHERE Transport_Dispo_ID = {{ ui.todopopup4.value.transport_Dispo_ID }};
END
ELSE
BEGIN
    INSERT INTO dbo.transport_dispo (
        Transport_Dispo_ID,
        to_Customer
    )
    VALUES (
        {{ ui.todopopup4.value.transport_Dispo_ID }},
        CASE 
            WHEN {{ ui.todopopup4.value.to_Customer }} = 'true' THEN 1
            WHEN {{ ui.todopopup4.value.to_Customer }} = 'false' THEN 0
            ELSE {{ ui.todopopup4.value.to_Customer }}
        END
    );
END
