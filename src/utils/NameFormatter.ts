export const formatName = (name: string): string => {
  // First trim and replace multiple spaces with single space
  return name
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .split(" ")
    .filter(word => word.length > 0) // Filter out empty strings
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
