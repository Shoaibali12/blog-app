const adminAuth = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // ✅ Proceed if user is admin
  } else {
    res.status(403);
    throw new Error("Access Denied: Admins only");
  }
};

export { adminAuth };
