import express from "express";

const router = express.Router();

//Renderea la página del chat
router.get("/", (req, res) => {
  res.render("chat", {});
});

export default router;
