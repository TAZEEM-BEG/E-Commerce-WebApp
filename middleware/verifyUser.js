import jwt from "jsonwebtoken";

const verifyUser = (roles = []) => {
  return (req, res, next) => {
    try {
      let token = req.cookies?.token || req.headers["authorization"];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      // Remove "Bearer "
      if (typeof token === "string" && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      console.log("Decoded token:", decoded);


      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default verifyUser;
