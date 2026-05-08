import * as React from "react";

const AppStateContext = React.createContext(null);
const STORAGE_KEY = "selectedIngredients";

function readSelectedIngredients() {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read selected ingredients from localStorage:", error);
    return [];
  }
}

export function AppStateProvider({ children }) {
  const [selectedIngredients, setSelectedIngredients] = React.useState(readSelectedIngredients);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIngredients));
    } catch (error) {
      console.error("Failed to save selected ingredients to localStorage:", error);
    }
  }, [selectedIngredients]);

  const value = React.useMemo(
    () => ({ selectedIngredients, setSelectedIngredients }),
    [selectedIngredients]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = React.useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}