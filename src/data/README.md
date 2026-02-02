# Data layer (`@/data`)

Use **`@/data`** everywhere you need logistics data. Right now all sources use **dummy data**; you can connect a real database later via credentials.

## Contents

- **`logistics.js`** – Generic logistics datasets (operations, fleet, warehouses, analytics, reports).
- **`containersData.js`** – Container/shipment data + table config: `containers`, `columns`, `headerFields`, `detailFields`, `filterFields`. Schema matches your JSON (Container_No, MBL_No, Status_Dispo, ETA_PortOfDischarge, statusOverAll, etc.).
- **`dataSource.js`** – Central API: `getData(sourceKey)`. Returns rows for tables. **Add your DB credentials here** when ready.
- **`index.js`** – Re-exports everything. `import { getData, datasets, containers, containersConfig } from '@/data'`.

## Usage

```js
import { getData, DATA_SOURCE_KEYS } from '@/data';

// Load containers (dummy now; DB later)
const rows = await getData('containers');

// Other keys: operations, fleet, warehouses, analytics, reports, dashboard, database
```

## Where is the dummy data?

- **`containersData.js`** – Container rows + `columns`, `headerFields`, `detailFields`, `filterFields`. Matches your JSON schema (Container_No, MBL_No, Status_Dispo, ETA_PortOfDischarge, statusOverAll, etc.).
- **`logistics.js`** – Generic datasets: `datasets.dashboard`, `operations`, `fleet`, `warehouses`, `analytics`, `reports`.

Dashboard, Tables, and Reports all use **`@/data`** (see above). No dummy data lives outside `src/data`.

## How do I add my database credentials?

1. Add credentials (e.g. env vars like `VITE_DB_URL`, `VITE_DB_KEY`) and use them in **`dataSource.js`**.
2. In `getData()`, when `sourceKey === 'database'`, call your API or DB (e.g. Supabase, REST) instead of returning dummy data.
3. The **Triggers → On init → Load data** flow in the component editor uses `getData()`. Once `getData('database', { credentials })` hits your DB, tables will load from it automatically.

## Triggers & actions (UI Bakery–style)

- **Triggers**: On init, On submit, On click, On row click, On change.
- **Actions**: Load data, Navigate, Call API, Custom code, Open modal.
- Configure in **Edit component → Triggers**. Add e.g. **On init → Load data → Containers** to load container data when a table mounts.
