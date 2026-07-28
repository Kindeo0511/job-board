export function formatExperience(minExp, maxExp) {
  const hasMin = minExp != null;
  const hasMax = maxExp != null;
  const yearLabel = (n) => (n === 1 ? "year" : "years");

  if (hasMin && hasMax) {
    if (minExp === maxExp) {
      return `${minExp.toLocaleString()} ${yearLabel(minExp)} experience`;
    }
    return `${minExp.toLocaleString()} - ${maxExp.toLocaleString()} ${yearLabel(maxExp)} experience`;
  }
  if (hasMin) {
    return `${minExp.toLocaleString()}+ ${yearLabel(minExp)} experience`;
  }
  if (hasMax) {
    return `Up to ${maxExp.toLocaleString()} ${yearLabel(maxExp)} experience`;
  }
  return "";
}
