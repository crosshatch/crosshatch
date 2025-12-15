import { formatDate, formatDistance } from "date-fns"

export const fmt = {
  date: {
    absolute: (d: Date) => formatDate(d, "MMMM dd, yyyy"),
    relative: (d: Date) => formatDistance(d, new Date(), { addSuffix: true }),
  },
  address: {
    abbreviated: (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`,
  },
}
