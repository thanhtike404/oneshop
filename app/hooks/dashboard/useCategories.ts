import { useQuery } from "@tanstack/react-query";

async function getCategories() {
  const response = await fetch("/api/v1/dashboard/categories");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}