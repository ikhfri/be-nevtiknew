
import {
  voteCandidate,
  getWinner,
  hasVoted,
  getVotes,
  getUsersWithVoteStatus,
  getVotesById,
} from "../controllers/vote.controller";
import { authenticateJWT } from "../middleware/authMiddleware";
import { authorizeAdmin } from "../middleware/authorizeAdmin";
import { checkIfVoted } from "../middleware/checkVoteMiddleware";

const voteRouter = require("express").Router();

voteRouter.post("/", authenticateJWT, checkIfVoted, voteCandidate);
voteRouter.get("/winner", authenticateJWT, authorizeAdmin, getWinner);
voteRouter.get("/check", authenticateJWT, hasVoted);
voteRouter.get("/calculation", getVotes)
voteRouter.get("/all", authenticateJWT, authorizeAdmin, getUsersWithVoteStatus);
voteRouter.get("/:id", authenticateJWT, authorizeAdmin, getVotesById);


export default voteRouter;
