"use strict";
// routes/auth.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post('/login', auth_controller_1.authController.login);
// POST /api/auth/refresh
router.post('/refresh', auth_controller_1.authController.refresh);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map