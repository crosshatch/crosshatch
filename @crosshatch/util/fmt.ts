import { formatDate, formatDistance } from "date-fns"

export const fmt = {
  address: {
    abbreviated: (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`,
  },
  amount: (v: string) => `${parseInt(v) * 1_000_000}`,
  date: {
    absolute: (d: Date) => formatDate(d, "MMMM dd, yyyy"),
    relative: (d: Date) => formatDistance(d, new Date(), { addSuffix: true }),
  },
}
