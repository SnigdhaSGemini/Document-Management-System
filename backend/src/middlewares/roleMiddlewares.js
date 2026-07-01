export const allowedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user._doc;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No user found",
        });
      }

      // allow access to required roles only
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Access denied",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Something went wrong",
      });
    }
  };
};