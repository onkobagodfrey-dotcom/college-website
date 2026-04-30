import { courses } from "../data/courses.config";
import { hssSeries } from "../data/hss.series";

// Normalize helper (VERY IMPORTANT)
const normalize = (id) => id?.toLowerCase()?.trim();

export function getActiveCourses() {
  return courses.filter(c => c.active);
}

export function getCourseContent(id) {
  const key = normalize(id);

  switch (key) {

    case "ic3":
      return ["Word", "Excel", "Internet", "Email"];

    case "aic3":
      return ["Advanced Word", "Advanced Excel", "Security"];

    case "hss":
      return hssSeries;

    default:
      return [];
  }
}