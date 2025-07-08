import express from "express";
const router = express.Router();
import multer from "multer";

import { getImageUrls, getProfilePic, upload } from "../supabase.js";

// GET images by UID
router.get("/images/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const urls = await getImageUrls(uid);
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET profile picture by UID
router.get("/profile-pic/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const profilePicUrl = await getProfilePic(uid);
    res.json({ url: profilePicUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const storage = multer.memoryStorage(); // store image in memory as buffer
const uploadMiddleware = multer({ storage });
router.post(
  "/upload/:uid",
  uploadMiddleware.single("image"),
  async (req, res) => {
    const { uid } = req.params;
    const file = req.file;

    if (!file || !file.buffer || !file.originalname) {
      return res.status(400).json({ error: "Image file is required" });
    }

    try {
      const path = await upload(uid, file.buffer, file.originalname);
      if (path) {
        res.json({ path });
      } else {
        res.status(500).json({ error: "Upload failed" });
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
