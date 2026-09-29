import { Player } from "@/lib/types";

/**
 * Sample player roster.
 *
 * In a production deployment this array would be replaced by a query
 * against a database or REST API (see lib/dataSource.ts). Nothing else
 * in the app assumes the data originates from a local file.
 */
export const players: Player[] = [
  {
    id: "arjun-kumar",
    name: "Arjun Kumar",
    position: "Striker",
    team: "MKCE United",
    number: 9,
    avatarColor: "#22c55e",
  },
  {
    id: "daniel-joseph",
    name: "Daniel Joseph",
    position: "Forward",
    team: "Coimbatore FC",
    number: 11,
    avatarColor: "#38bdf8",
  },
  {
    id: "rahul-prakash",
    name: "Rahul Prakash",
    position: "Winger",
    team: "MKCE United",
    number: 7,
    avatarColor: "#f59e0b",
  },
  {
    id: "alex-martin",
    name: "Alex Martin",
    position: "Midfielder",
    team: "PSG Academy",
    number: 8,
    avatarColor: "#f472b6",
  },
];
