"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const validator_middleware_1 = require("../middleware/validator.middleware");
const zod_schema_1 = require("../validators/zod.schema");
const router = express_1.default.Router();
router.post("/signup", (0, validator_middleware_1.validate)(zod_schema_1.registerSchema), (0, asyncHandler_1.default)(user_controller_1.signUp));
// signUp function is async function that returns promise, which doesn't match what router.post expects asyncHandler utility converts async function into a middleware function that Express can use
// Express Middleware Expects Synchronous Functions: router.post expects a function that returns void, not a Promise.
exports.default = router;
