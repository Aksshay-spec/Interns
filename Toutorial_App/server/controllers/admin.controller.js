import { Tenant } from "../models/tenant.model.js";
import { User } from "../models/user.model.js";

// Get all pending tenant requests
export const getPendingTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({ status: "inactive" })
      .populate("ownerUserId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Pending tenants fetched successfully",
      data: tenants,
    });
  } catch (error) {
    console.error("Get Pending Tenants Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get all tenants (for admin dashboard)
export const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find()
      .populate("ownerUserId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tenants fetched successfully",
      data: tenants,
    });
  } catch (error) {
    console.error("Get All Tenants Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const approveTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
      });
    }

    if (tenant.status === "active") {
      return res.status(400).json({
        message: "Tenant already approved",
      });
    }

    tenant.status = "active";
    await tenant.save();

    // Also update the owner user status to active
    await User.findByIdAndUpdate(tenant.ownerUserId, { status: "active" });

    return res.status(200).json({
      message: "Tenant approved successfully",
      data: tenant,
    });
  } catch (error) {
    console.error("Approve Tenant Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const rejectTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
      });
    }

    tenant.status = "inactive";
    await tenant.save();

    // Also update the owner user status to inactive
    await User.findByIdAndUpdate(tenant.ownerUserId, { status: "inactive" });

    return res.status(200).json({
      message: "Tenant rejected successfully",
      data: tenant,
    });
  } catch (error) {
    console.error("Reject Tenant Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const blockTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
      });
    }

    tenant.status = "blocked";
    await tenant.save();

    // Also update the owner user status to blocked
    await User.findByIdAndUpdate(tenant.ownerUserId, { status: "blocked" });

    return res.status(200).json({
      message: "Tenant blocked successfully",
      data: tenant,
    });
  } catch (error) {
    console.error("Block Tenant Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};