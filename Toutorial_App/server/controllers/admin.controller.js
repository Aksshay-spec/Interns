import { Tenant } from "../models/tenant.model.js";
import { User } from "../models/user.model.js";

import { sendTenantMail } from "../services/mail/mail.service.js";
import { MAIL_TYPES } from "../services/mail/mail.constant.js";

/**
 * Get all pending tenant requests
 */
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

/**
 * Get all tenants (Admin Dashboard with pagination)
 */
export const getAllTenants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalTenants = await Tenant.countDocuments();

    const tenants = await Tenant.find()
      .populate("ownerUserId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      tenants,
      currentPage: page,
      totalPages: Math.ceil(totalTenants / limit),
      totalTenants,
    });
  } catch (error) {
    console.error("Get All Tenants Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Approve Tenant
 */
export const approveTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(id)
      .populate("ownerUserId", "name email");

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

    await User.findByIdAndUpdate(
      tenant.ownerUserId._id,
      { status: "active" }
    );

    
    sendTenantMail(
      MAIL_TYPES.TENANT_APPROVED,
      {
        name: tenant.ownerUserId.name,
        email: tenant.ownerUserId.email,
      }
    ).catch((err) =>
      console.error("Approval Mail Error:", err)
    );

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

/**
 * Block Tenant
 */
export const blockTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(id)
      .populate("ownerUserId", "name email");

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
      });
    }

    tenant.status = "blocked";
    await tenant.save();

 
    await User.findByIdAndUpdate(
      tenant.ownerUserId._id,
      { status: "blocked" }
    );

    
    sendTenantMail(
      MAIL_TYPES.TENANT_BLOCKED,
      {
        name: tenant.ownerUserId.name,
        email: tenant.ownerUserId.email,
      }
    ).catch((err) =>
      console.error("Block Mail Error:", err)
    );

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

export const makeTenantInactive = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(id)
      .populate("ownerUserId", "name email");

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
      });
    }

    if (tenant.status === "inactive") {
      return res.status(400).json({
        message: "Tenant is already inactive",
      });
    }

    
    tenant.status = "inactive";
    await tenant.save();

    
    await User.findByIdAndUpdate(
      tenant.ownerUserId._id,
      { status: "inactive" }
    );

    
    sendTenantMail(
      MAIL_TYPES.TENANT_INACTIVE,
      {
        name: tenant.ownerUserId.name,
        email: tenant.ownerUserId.email,
      }
    ).catch((err) =>
      console.error("Inactive Mail Error:", err)
    );

    return res.status(200).json({
      message: "Tenant marked as inactive successfully",
      data: tenant,
    });

  } catch (error) {
    console.error("Make Tenant Inactive Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};