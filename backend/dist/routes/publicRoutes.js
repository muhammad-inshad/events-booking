"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoutes = void 0;
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const router = (0, express_1.Router)();
exports.publicRoutes = router;
router.get('/services', publicController_1.getPublicServices);
router.get('/services/:id', publicController_1.getPublicServiceById);
