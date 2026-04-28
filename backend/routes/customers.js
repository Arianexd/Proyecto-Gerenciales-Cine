const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Customer = require("../models/Customer");
const User = require("../models/User");
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

function buildUsernameFromName(name, surname, email) {
  const base = `${name || ""}.${surname || ""}`
    .replace(/\s+/g, "")
    .toLowerCase();
  if (base && base !== ".") return base;
  return (email || "").split("@")[0].toLowerCase();
}

async function attachAccountFlags(customers) {
  if (!customers.length) return customers;
  const ids = customers.map((c) => c._id);
  const users = await User.find({ CustomerID: { $in: ids } }).select(
    "CustomerID IsActive",
  );
  const byCustomer = new Map(
    users.map((u) => [u.CustomerID.toString(), u]),
  );
  return customers.map((c) => {
    const obj = c.toObject ? c.toObject() : c;
    const u = byCustomer.get(c._id.toString());
    obj.HasAccount = Boolean(u);
    obj.AccountActive = u ? Boolean(u.IsActive) : false;
    return obj;
  });
}

// GET all customers (Admin and Cajero can view)
router.get("/", requireAuth, requireAdminOrCajero, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    const enriched = await attachAccountFlags(customers);
    res.json(enriched);
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
    const [enriched] = await attachAccountFlags([customer]);
    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new customer (Admin and Cajero can create)
// Optionally accepts Password to create a linked User account so the customer can log in.
router.post("/", requireAuth, requireAdminOrCajero, async (req, res) => {
  try {
    const payload = { ...req.body };
    const password = payload.Password;
    delete payload.Password;
    delete payload.ConfirmPassword;

    if (payload.CI) payload.CI = String(payload.CI).trim();
    if (payload.Email) payload.Email = String(payload.Email).trim().toLowerCase();

    if (payload.CI) {
      const ciOwner = await Customer.findOne({ CI: payload.CI });
      if (ciOwner) {
        return res.status(409).json({ error: "CI already exists" });
      }
    }

    if (password) {
      if (String(password).length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }
      const emailTaken = await User.findOne({ Email: payload.Email });
      if (emailTaken) {
        return res
          .status(409)
          .json({ error: "There is already an account with that email" });
      }
    }

    const computedAge = calculateAgeFromBirthDate(payload.BirthDate);
    if (computedAge !== undefined) {
      payload.Age = computedAge;
    }

    const customer = new Customer(payload);
    await customer.save();

    if (password) {
      const passwordHash = await bcrypt.hash(String(password), 10);
      try {
        await User.create({
          Username: buildUsernameFromName(
            customer.Name,
            customer.Surname,
            customer.Email,
          ),
          Email: customer.Email,
          PasswordHash: passwordHash,
          Role: "CUSTOMER",
          CustomerID: customer._id,
        });
      } catch (userError) {
        // Roll back the customer if user creation failed (e.g. duplicate username)
        await Customer.findByIdAndDelete(customer._id);
        if (userError.code === 11000) {
          return res.status(409).json({
            error: "Email or username already in use for an account",
          });
        }
        throw userError;
      }
    }

    const [enriched] = await attachAccountFlags([customer]);
    res.status(201).json(enriched);
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
    delete payload.Password;
    delete payload.ConfirmPassword;

    if (payload.CI) payload.CI = String(payload.CI).trim();
    if (payload.Email) payload.Email = String(payload.Email).trim().toLowerCase();

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

    // Keep the linked User email in sync if it changed
    if (payload.Email && payload.Email !== existingCustomer.Email) {
      await User.findOneAndUpdate(
        { CustomerID: customer._id },
        { Email: payload.Email },
      );
    }

    const [enriched] = await attachAccountFlags([customer]);
    res.json(enriched);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST set or reset the password for a customer's login account.
// Creates the User if it does not yet exist.
router.post(
  "/:id/set-password",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const { Password } = req.body;
      if (!Password || String(Password).length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      const passwordHash = await bcrypt.hash(String(Password), 10);
      const existingUser = await User.findOne({ CustomerID: customer._id });

      if (existingUser) {
        existingUser.PasswordHash = passwordHash;
        existingUser.IsActive = true;
        await existingUser.save();
      } else {
        const emailTaken = await User.findOne({ Email: customer.Email });
        if (emailTaken) {
          return res.status(409).json({
            error: "There is already an account with that email",
          });
        }
        await User.create({
          Username: buildUsernameFromName(
            customer.Name,
            customer.Surname,
            customer.Email,
          ),
          Email: customer.Email,
          PasswordHash: passwordHash,
          Role: "CUSTOMER",
          CustomerID: customer._id,
        });
      }

      res.json({ message: "Password updated", HasAccount: true });
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(409)
          .json({ error: "Email or username already in use" });
      }
      res.status(400).json({ error: error.message });
    }
  },
);

// DELETE customer (also removes its login account)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    await User.deleteOne({ CustomerID: customer._id });
    res.json({ message: "Customer deleted successfully", customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
