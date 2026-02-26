import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, isAuthenticated } from "@/apis/authApi";

export function useUser() {
  const navigate = useNavigate();

  // Check authentication before rendering
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    retry: 1,
    enabled: isAuthenticated(), // Only fetch if authenticated
  });

  return {
    user,
    isLoading,
    error,
    refetch,
  };
}
