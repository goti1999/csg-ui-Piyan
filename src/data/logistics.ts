export type RecordRow = {
  id: string;
  name: string;
  status: "on-time" | "delayed" | "at-risk" | "completed";
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  eta: string;
  progress: number;
  amount: number;
  location: string;
  updated: string;
};

const statuses: RecordRow["status"][] = ["on-time", "delayed", "at-risk", "completed"];
const priorities: RecordRow["priority"][] = ["low", "medium", "high", "critical"];
const categories = ["Linehaul", "Last Mile", "Inbound", "Outbound", "Warehouse", "Analytics"];
const locations = ["NYC", "LAX", "DFW", "ORD", "ATL", "MIA", "SEA", "DEN", "PHX", "BOS"];

function randomItem<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomProgress() {
  return Math.min(100, Math.max(5, Math.round(Math.random() * 100)));
}

function randomAmount() {
  return Math.round(500 + Math.random() * 9500);
}

function randomDate(days = 14) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date.toISOString();
}

export function generateRecords(count: number, prefix: string): RecordRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    name: `${prefix.toUpperCase()} Item ${i + 1}`,
    status: randomItem(statuses),
    category: randomItem(categories),
    priority: randomItem(priorities),
    eta: randomDate(10),
    progress: randomProgress(),
    amount: randomAmount(),
    location: randomItem(locations),
    updated: randomDate(5),
  }));
}

export const datasets = {
  dashboard: generateRecords(24, "dash"),
  operations: generateRecords(36, "ops"),
  fleet: generateRecords(32, "fleet"),
  warehouses: generateRecords(28, "wh"),
  analytics: generateRecords(30, "bi"),
  reports: generateRecords(22, "rep"),
};
