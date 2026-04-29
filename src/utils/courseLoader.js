import { courses } from "../data/courses.config";
import { hssSeries } from "../data/hss.series";

export function getActiveCourses() {
  return courses.filter(c => c.active);
}

export function getCourseContent(id) {
  if (id === "ic3") {
    return ["Word", "Excel", "Internet", "Email"];
  }

  if (id === "aic3") {
    return ["Advanced Word", "Advanced Excel", "Security"];
  }

  if (id === "hss") {
    return hssSeries;
  }

  return [];
}