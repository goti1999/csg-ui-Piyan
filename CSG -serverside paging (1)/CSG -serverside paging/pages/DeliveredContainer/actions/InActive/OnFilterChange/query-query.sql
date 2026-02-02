// Use the dynamic filter correctly in the WHERE clause
SELECT *
FROM {{actions.Table.data}}
WHERE {{state.DynamicFilter}}
