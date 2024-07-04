export const fetchTotalEmployees = async () => {
  try {
    const response = await fetch("/api/dashboard");
    const result = await response.json();
    if (result.success) {
      return result.totalEmployees;
    } else {
      console.error("Failed to fetch total employees:", result.error);
      return 0;
    }
  } catch (error) {
    console.error("Error fetching total employees:", error);
    return 0;
  }
};
