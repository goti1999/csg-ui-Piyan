-- Step 1: Collect multiple selected rows
DECLARE @SelectedRows TABLE (
    CustomerID NVARCHAR(50),
    MBL_ID NVARCHAR(50),
    ContainerID NVARCHAR(50)
);

INSERT INTO @SelectedRows (CustomerID, MBL_ID, ContainerID)
SELECT 
    value.CustomerID,
    value.MBL_ID,
    value.ContainerID
FROM OPENJSON({{steps.code2.data}})
WITH (
    CustomerID NVARCHAR(50) '$.CustomerID',
    MBL_ID NVARCHAR(50) '$.MBL_ID',
    ContainerID NVARCHAR(50) '$.ContainerID'
) AS value;

INSERT INTO dbo.Transport_Dispo_History (
    CustomerID,
    MBL_ID,
    ContainerID,
    [Timestamp],
    [User],
    direction,
    Relation,
    Interface,
    Pincode,
    DropOff_Terminal
)
VALUES (
    s.CustomerID,
    s.MBL_ID,
    s.ContainerID,
    {{ moment().utcOffset(0, true).toISOString() }},
    {{steps.BuildUpsertSQL.data.user}},
    'INPUT',              
    'Clone',              
    'UI',                
    {{ui.MultiEditform4.value.Pincode}},
    {{ui.MultiEditform4.value.DropOff_Terminal}} 
  );
