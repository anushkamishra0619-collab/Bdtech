import { societiesData } from "./societiesData";

export const SOCIETIES_STORAGE_KEY = "societyselect.societies";

const normalizeSocieties = (societies) =>
  societies.map((society) => ({
    ...society,
    isActive: society.isActive !== false,
  }));

export const getSocieties = () => {
  const storedValue = window.localStorage.getItem(SOCIETIES_STORAGE_KEY);
  if (!storedValue) return normalizeSocieties(societiesData);

  let societies;
  try {
    societies = JSON.parse(storedValue);
  } catch {
    throw new Error("Saved society data is unreadable. Clear the local society data and try again.");
  }

  if (
    !Array.isArray(societies) ||
    societies.some(
      (society) =>
        !society ||
        typeof society.id !== "string" ||
        typeof society.name !== "string" ||
        !society.details,
    )
  ) {
    throw new Error("Saved society data has an invalid format.");
  }
  if (new Set(societies.map((society) => society.id)).size !== societies.length) {
    throw new Error("Saved society data contains duplicate IDs.");
  }

  return normalizeSocieties(societies);
};

export const saveSocieties = (societies) => {
  if (!Array.isArray(societies)) {
    throw new TypeError("Societies must be saved as an array.");
  }
  if (new Set(societies.map((society) => society.id)).size !== societies.length) {
    throw new Error("Society IDs must be unique.");
  }

  const normalizedSocieties = normalizeSocieties(societies);
  window.localStorage.setItem(
    SOCIETIES_STORAGE_KEY,
    JSON.stringify(normalizedSocieties),
  );
  return normalizedSocieties;
};
