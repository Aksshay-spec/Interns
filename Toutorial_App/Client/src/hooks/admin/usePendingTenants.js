import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllTenantsApi,
  approveTenantApi,
  blockTenantApi,
} from "@/services/admin.api";
import toast from "react-hot-toast";

export const usePendingTenants = (currentPage) => {
  const queryClient = useQueryClient();
  const limit = 2;

 
  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-tenants", currentPage],
    queryFn: () => getAllTenantsApi(currentPage, limit),
    keepPreviousData: true,
  });
  console.log("API Response:", data);


  const approveMutation = useMutation({
    mutationFn: approveTenantApi,
    onSuccess: () => {
      toast.success("Tenant approved successfully");
      queryClient.invalidateQueries(["all-tenants"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to approve tenant");
    },
  });


  const blockMutation = useMutation({
    mutationFn: blockTenantApi,
    onSuccess: () => {
      toast.success("Tenant blocked successfully");
      queryClient.invalidateQueries(["all-tenants"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to block tenant");
    },
  });

  const handleApprove = (tenantId) => {
    if (window.confirm("Are you sure you want to approve this tenant?")) {
      approveMutation.mutate(tenantId);
    }
  };

  const handleBlock = (tenantId) => {
    if (window.confirm("Are you sure you want to block this tenant?")) {
      blockMutation.mutate(tenantId);
    }
  };

  const isLoading_ = approveMutation.isPending || blockMutation.isPending;

  return {
    tenants: data?.data?.tenants || [],
    totalPages: data?.data?.totalPages || 1,
    currentPage: data?.data?.currentPage || 1,
    isLoading,
    isError,
    handleApprove,
    handleBlock,
    isActionLoading: isLoading_,
  };
};