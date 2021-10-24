import { FACULTY_OPTIONS } from "constants/options";

/**
 * Parses faculties to a form that is accepted by the backend.
 *
 * @param faculties selected option of faculties.
 */
export const parseFaculties = (faculties: Option[]): string => {
  if (!faculties.length) return " ";

  return faculties.map((option) => option.value as string).toString();
};

/**
 * Parses faculties from the backend to an array of Option (a form recognizable by our Select input)
 *
 * @param faculties faculties in concatenated string form.
 */
export const facultiesToOptions = (faculties?: string): Option[] => {
  if (!faculties) return [];

  const arr = faculties?.split(",");

  return (
    arr?.map((faculty) => ({
      label: faculty,
      value: faculty,
    })) || []
  );
};

export const checkAllFacultiesPresent = (eligibleFaculties?: string) => {
  if (!eligibleFaculties) return false;

  const arr = eligibleFaculties?.split(",");

  return FACULTY_OPTIONS.length === arr.length;
};
