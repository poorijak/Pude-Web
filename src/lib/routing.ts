export function getEntryPath(hasCompletedAssessment: boolean): "/" | "/assessment" {
  return hasCompletedAssessment ? "/" : "/assessment";
}
