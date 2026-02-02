/**
 * Container / shipment dummy data for logistics.
 * Use via dataSource.getData('containers'). Later: connect real DB with credentials.
 */

const statuses = ['in-transit', 'at-port', 'customs', 'delivered', 'delayed', 'at-risk'];
const origins = ['Shanghai', 'Rotterdam', 'Singapore', 'Los Angeles', 'Hamburg', 'Dubai', 'Busan', 'Antwerp'];
const destinations = ['NYC', 'LAX', 'Houston', 'Chicago', 'Savannah', 'Miami', 'Seattle', 'Oakland'];
const vessels = ['MSC Gulsun', 'Ever Given', 'COSCO Shipping', 'Maersk Eindhoven', 'HMM Oslo', 'ONE Stork'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysFromNow = 14) {
  const d = new Date();
  d.setDate(d.getDate() + (Math.random() * 2 - 0.5) * daysFromNow);
  return d.toISOString().split('T')[0];
}

function containerNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let n = '';
  for (let i = 0; i < 4; i++) n += letters[Math.floor(Math.random() * 26)];
  n += String(Math.floor(100000 + Math.random() * 900000));
  return n;
}

export function generateContainers(count = 24) {
  return Array.from({ length: count }, (_, i) => {
    const num = containerNumber();
    return {
    id: `cnt-${i + 1}`,
    containerNumber: num,
    name: num,
    status: randomItem(statuses),
    origin: randomItem(origins),
    destination: randomItem(destinations),
    vessel: randomItem(vessels),
    eta: randomDate(14),
    etd: randomDate(-7),
    category: randomItem(['Linehaul', 'Last Mile', 'Inbound', 'Outbound']),
    priority: randomItem(['low', 'medium', 'high', 'critical']),
    progress: Math.min(100, Math.max(0, Math.round(Math.random() * 100))),
    amount: Math.round(1200 + Math.random() * 8800),
    location: randomItem([...origins, ...destinations]),
    updated: randomDate(-3),
  };
  });
}

export const containers = generateContainers(24);
