"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { getPlayers, getSeasons } from "@/lib/dataSource";
import { ALL_PLAYERS_ID } from "@/lib/types";

interface SelectionContextValue {
  selectedPlayerId: string;
  setSelectedPlayerId: (id: string) => void;
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;
  seasons: string[];
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const seasons = useMemo(() => getSeasons(), []);
  const players = useMemo(() => getPlayers(), []);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    players[0]?.id ?? ALL_PLAYERS_ID
  );
  const [selectedSeason, setSelectedSeason] = useState<string>(
    seasons[seasons.length - 1] ?? "All"
  );

  const value = useMemo(
    () => ({ selectedPlayerId, setSelectedPlayerId, selectedSeason, setSelectedSeason, seasons }),
    [selectedPlayerId, selectedSeason, seasons]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within a SelectionProvider");
  return ctx;
}
