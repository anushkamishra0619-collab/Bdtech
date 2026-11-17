import { societiesData } from "./societiesData";

export const SOCIETIES_STORAGE_KEY = "societyselect.societies";

const normalizeSocieties = (societies) =>
  societies.map((society) => ({
    ...society,
    isActive: society.isActive !== false,
  }));

const isValidSociety = (society) => {
  const details = society?.details;
  const deadline = new Date(`${society?.deadline}T00:00:00`);

  return (
    society &&
    typeof society.id === "string" &&
    society.id.trim() &&
    typeof society.name === "string" &&
    society.name.trim() &&
    ["Technical", "Cultural"].includes(society.category) &&
    typeof society.description === "string" &&
    typeof society.isOpen === "boolean" &&
    !Number.isNaN(deadline.getTime()) &&
    details &&
    typeof details === "object" &&
    !Array.isArray(details) &&
    (details.requiredSkills === undefined ||
      (Array.isArray(details.requiredSkills) &&
        details.requiredSkills.every((skill) => typeof skill === "string"))) &&
    (details.availablePositions === undefined ||
      (Array.isArray(details.availablePositions) &&
        details.availablePositions.every(
          (position) =>
            position &&
            typeof position.title === "string" &&
            Number.isFinite(Number(position.openings)) &&
            Number(position.openings) >= 0,
        )))
  );
};

export const getSocieties = () => {
  const storedValue = window.localStorage.getItem(SOCIETIES_STORAGE_KEY);
  if (!storedValue) return normalizeSocieties(societiesData);

  let societies;
  try {
    societies = JSON.parse(storedValue);
  } catch {
    throw new Error("Saved society data is unreadable. Clear the local society data and try again.");
  }

  if (!Array.isArray(societies) || societies.some((society) => !isValidSociety(society))) {
    throw new Error("Saved society data has an invalid format.");
  }
  if (new Set(societies.map((society) => society.id)).size !== societies.length) {
    throw new Error("Saved society data contains duplicate IDs.");
  }

  return normalizeSocieties(societies);
};

export const saveSocieties = (societies) => {
  if (!Array.isArray(societies) || societies.some((society) => !isValidSociety(society))) {
    throw new TypeError("Societies must contain valid society records.");
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
