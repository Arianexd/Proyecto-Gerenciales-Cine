const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const {
  requireAuth,
  requireAdmin,
  requireAdminOrCajero,
  isOwnerOrAdmin,
} = require("../middleware/auth");

function calculateAgeFromBirthDate(birthDate) {
  if (!birthDate) return undefined;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return undefined;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(age, 0);
}

// GET all customers (Admin and Cajero can view
router.get("/", requireAuth, requireAdminOrCajero, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single customer
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    if (!isOwnerOrAdmin(customer._id, req)) {
      return res
        .status(403)
        .json({ error: "You do not have permission to view this customer" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new customer (Admin and Cajero can create)
router.post("/", requireAuth, requireAdminOrCajero, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.CI) payload.CI = String(payload.CI).trim();

    if (payload.CI) {
      const ciOwner = await Customer.findOne({ CI: payload.CI });
      if (ciOwner) {
        return res.status(409).json({ error: "CI already exists" });
      }
    }

    const computedAge = calculateAgeFromBirthDate(payload.BirthDate);
    if (computedAge !== undefined) {
      payload.Age = computedAge;
    }

    const customer = new Customer(payload);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update customer
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const existingCustomer = await Customer.findById(req.params.id);
    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    if (!isOwnerOrAdmin(existingCustomer._id, req)) {
      return res
        .status(403)
        .json({ error: "You do not have permission to update this customer" });
    }
    const payload = { ...req.body };
    if (payload.CI) payload.CI = String(payload.CI).trim();

    if (payload.CI) {
      const ciOwner = await Customer.findOne({
        CI: payload.CI,
        _id: { $ne: req.params.id },
      });
      if (ciOwner) {
        return res.status(409).json({ error: "CI already exists" });
      }
    }

    const computedAge = calculateAgeFromBirthDate(payload.BirthDate);
    if (computedAge !== undefined) {
      payload.Age = computedAge;
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE customer
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully", customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
