import { LANGUAGE_TO_FLAG } from "../constants";

// utility function to capitalize the first letter of any string
export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// utility function to get the dynamic url for showing countries flag.

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (!countryCode) return null;

  return `http://flagcdn.com/24x18/${countryCode}.png`;
}
