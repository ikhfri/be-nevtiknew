import { createCandidate, deleteCandidate, getCandidateById, getCandidates,  updateCandidate } from "../controllers/candidate.controller";
import { authenticateJWT } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin";
import { upload } from "../middleware/uploadMiddleware";
const candiatesRouter = require("express").Router();

candiatesRouter.post(
  "/",
  authenticateJWT,
  authorizeAdmin,
  upload.single("image"),
  createCandidate
);
candiatesRouter.get("/", authenticateJWT, getCandidates);
candiatesRouter.get("/:id", authenticateJWT, getCandidateById)
candiatesRouter.put("/:id", authenticateJWT, updateCandidate);
candiatesRouter.delete("/:id", authenticateJWT, deleteCandidate);


export default candiatesRouter
