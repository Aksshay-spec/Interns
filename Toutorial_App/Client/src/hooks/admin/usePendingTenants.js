import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingTenantsApi,
  approveTenantApi,
  rejectTenantApi,
  blockTenantApi,
} from "@/services/admin.api";
import toast from "react-hot-toast";

export const usePendingTenants = () => {
  const queryClient = useQueryClient();

  // Fetch pending tenants
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pendingTenants"],
    queryFn: getPendingTenantsApi,
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: approveTenantApi,
    onSuccess: () => {
      toast.success("Tenant approved successfully");
      queryClient.invalidateQueries(["pendingTenants"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to approve tenant");
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: rejectTenantApi,
    onSuccess: () => {
      toast.success("Tenant rejected successfully");
      queryClient.invalidateQueries(["pendingTenants"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reject tenant");
    },
  });

  // Block mutation
  const blockMutation = useMutation({
    mutationFn: blockTenantApi,
    onSuccess: () => {
      toast.success("Tenant blocked successfully");
      queryClient.invalidateQueries(["pendingTenants"]);
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

  const handleReject = (tenantId) => {
    if (window.confirm("Are you sure you want to reject this tenant?")) {
      rejectMutation.mutate(tenantId);
    }
  };

  const handleBlock = (tenantId) => {
    if (window.confirm("Are you sure you want to block this tenant?")) {
      blockMutation.mutate(tenantId);
    }
  };

  const isLoading_ = approveMutation.isPending || rejectMutation.isPending || blockMutation.isPending;

  return {
    tenants: data?.data?.data || [],
    isLoading,
    isError,
    handleApprove,
    handleReject,
    handleBlock,
    isActionLoading: isLoading_,
  };
};
