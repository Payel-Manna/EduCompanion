// routes/studyMaterials.routes.js
import express from "express";
import {
  addMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  getTopics,
  getStats,
} from "../controllers/studyMaterial.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const studyMaterialRouter = express.Router();

// IMPORTANT: Put specific routes BEFORE parameterized routes
studyMaterialRouter.get("/topics", isAuth, getTopics);
studyMaterialRouter.get("/stats", isAuth, getStats);

// CRUD operations
studyMaterialRouter.post("/", isAuth, addMaterial);
studyMaterialRouter.get("/", isAuth, getAllMaterials);
studyMaterialRouter.get("/:id", isAuth, getMaterialById);
studyMaterialRouter.put("/:id", isAuth, updateMaterial);
studyMaterialRouter.delete("/:id", isAuth, deleteMaterial);

export default studyMaterialRouter;