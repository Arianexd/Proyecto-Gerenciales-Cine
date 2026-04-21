// backend/middleware/authMiddleware.js
const checkRole = (roles) => {
  return (req, res, next) => {
    // Nota: req.user debe ser inyectado previamente por tu middleware de JWT/Auth
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado: Inicie sesión" });
    }

    if (!roles.includes(req.user.Role)) {
      return res.status(403).json({ 
        message: `Acceso prohibido: Se requiere rol ${roles.join(' o ')}` 
      });
    }
    next();
  };
};

module.exports = { checkRole };
