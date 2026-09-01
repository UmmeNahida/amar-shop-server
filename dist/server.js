var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};

// src/server.ts
var import_mongoose2 = __toESM(require("mongoose"));

// src/app/confic/env.ts
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var loadEnvVars = () => {
  const requiredEnvVar = [
    "DB_URL",
    "PORT",
    "node_env",
    "bcrypt_salt_rounds",
    "secret",
    "expiresIn",
    "refresh_expiresIn",
    "refresh_secret",
    "CLOUD_NAME",
    "CLOUDE_API_KEY",
    "CLOUDE_API_SECRET"
  ];
  requiredEnvVar.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.port,
    DB_URL: process.env.DB_URL,
    node_env: process.env.node_env,
    bcrypt_salt_rounds: process.env.bcrypt_salt_rounds,
    secret: process.env.secret,
    expiresIn: process.env.expiresIn,
    refresh_secret: process.env.refresh_secret,
    refresh_expiresIn: process.env.refresh_expiresIn,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUDE_API_KEY: process.env.CLOUDE_API_KEY,
    CLOUDE_API_SECRET: process.env.CLOUDE_API_SECRET
  };
};
var envVars = loadEnvVars();

// src/app.ts
var import_express4 = __toESM(require("express"));

// src/app/routes/routes.ts
var import_express3 = require("express");

// src/app/modules/Auth/auth.route.ts
var import_express = require("express");

// src/app/modules/Auth/auth.controller.ts
var import_http_status2 = __toESM(require("http-status"));

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (envVars.node_env === "development") {
      console.log("catch-err", err);
    }
    next(err);
  });
};

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/app/ErrorHandler/appErrors.ts
class AppError extends Error {
  statusCode;
  constructor(status, message, stack = "") {
    super(message);
    this.statusCode = status;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
var appErrors_default = AppError;

// src/app/modules/User/user.interface.ts
var Role;
((Role2) => {
  Role2["ADMIN"] = "ADMIN";
  Role2["CUSTOMER"] = "CUSTOMER";
})(Role ||= {});
var UserStatus;
((UserStatus2) => {
  UserStatus2["ACTIVE"] = "ACTIVE";
  UserStatus2["BLOCKED"] = "BLOCKED";
  UserStatus2["DELETED"] = "DELETED";
})(UserStatus ||= {});
var AuthProvider;
((AuthProvider2) => {
  AuthProvider2["CREDENTIALS"] = "CREDENTIALS";
  AuthProvider2["GOOGLE"] = "GOOGLE";
})(AuthProvider ||= {});
var AddressType;
((AddressType2) => {
  AddressType2["HOME"] = "HOME";
  AddressType2["OFFICE"] = "OFFICE";
  AddressType2["OTHER"] = "OTHER";
})(AddressType ||= {});

// src/app/modules/User/user.model.ts
var import_mongoose = require("mongoose");
var addressSchema = new import_mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(AddressType),
    default: "HOME" /* HOME */
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  landmark: {
    type: String
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  _id: true
});
var userSchema = new import_mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String
  },
  avatar: {
    public_id: String,
    url: String
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: "CUSTOMER" /* CUSTOMER */
  },
  provider: {
    type: String,
    enum: Object.values(AuthProvider),
    default: "CREDENTIALS" /* CREDENTIALS */
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: "ACTIVE" /* ACTIVE */
  },
  addresses: {
    type: [addressSchema],
    default: []
  },
  lastLoginAt: Date
}, {
  timestamps: true
});
var User = import_mongoose.model("User", userSchema);

// src/app/modules/Auth/auth.service.ts
var import_http_status = __toESM(require("http-status"));
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/app/utils/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var generateToken = (payload, sicret, expiresIn) => {
  const accessToken = import_jsonwebtoken.default.sign(payload, sicret, { expiresIn });
  return accessToken;
};

// src/app/modules/Auth/auth.service.ts
var credentialsLogin = async (payload) => {
  console.log("payload", payload);
  const user = await User.findOne({ email: payload.email, status: "ACTIVE" /* ACTIVE */ });
  if (!user) {
    throw new appErrors_default(import_http_status.default.BAD_REQUEST, "email is incorrect");
  }
  console.log("user", user);
  const isMatchPass = await import_bcryptjs.default.compare(payload.password, user.password);
  if (!isMatchPass) {
    throw new appErrors_default(import_http_status.default.BAD_REQUEST, "password is incorrect");
  }
  const payloadJwt = {
    email: user.email,
    role: user.role
  };
  const accessToken = generateToken(payloadJwt, envVars.secret, envVars.expiresIn);
  const refreshToken = generateToken(payloadJwt, envVars.refresh_secret, envVars.refresh_expiresIn);
  return {
    accessToken,
    refreshToken,
    user
  };
};

// src/app/modules/Auth/auth.controller.ts
var credentialsLogin2 = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const result = await credentialsLogin(userInfo);
  sendResponse(res, {
    success: true,
    statusCode: import_http_status2.default.CREATED,
    message: "User registered successfully.",
    data: result
  });
});

// src/app/modules/Auth/auth.route.ts
var route = import_express.Router();
route.post("/login", credentialsLogin2);
var authRoute = route;

// src/app/modules/User/user.router.ts
var import_express2 = __toESM(require("express"));

// src/app/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => async (req, res, next) => {
  let parsedData;
  console.log("req body data;", req.body);
  try {
    if (req.body?.data) {
      if (typeof req.body.data === "string") {
        parsedData = JSON.parse(req.body.data);
      } else {
        parsedData = req.body.data;
      }
    } else {
      parsedData = req.body;
    }
    const result = zodSchema.safeParse(parsedData);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten()
      });
    }
    req.body = result.data;
    next();
  } catch (err) {
    next(err);
  }
};

// src/app/modules/User/user.validation.ts
var import_zod = require("zod");
var createUserValidationSchema = import_zod.z.object({
  fullName: import_zod.z.string({
    error: "Full name is required"
  }).trim().min(2, "Full name must be at least 2 characters").max(50, "Full name cannot exceed 50 characters"),
  email: import_zod.z.string({
    error: "Email is required"
  }).trim().email("Invalid email address").toLowerCase(),
  phone: import_zod.z.string().trim().regex(/^(?:\+8801|01)[3-9]\d{8}$/, "Please enter a valid Bangladeshi phone number").optional(),
  password: import_zod.z.string({
    error: "Password is required"
  }).min(8, "Password must be at least 8 characters").max(100).regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
});

// src/app/modules/User/user.service.ts
var import_http_status3 = __toESM(require("http-status"));
var import_bcryptjs2 = __toESM(require("bcryptjs"));

// src/app/helper/datauri.ts
var import_parser = __toESM(require("datauri/parser.js"));
var parser = new import_parser.default;
var parseBufferToURI = (buffer) => parser.format("", buffer).content;
var datauri_default = parseBufferToURI;

// src/app/helper/cloudinary.ts
var import_cloudinary = require("cloudinary");
import_cloudinary.v2.config({
  cloud_name: envVars.CLOUD_NAME,
  api_key: envVars.CLOUDE_API_KEY,
  api_secret: envVars.CLOUDE_API_SECRET
});
var cloudinary_default = import_cloudinary.v2;

// src/app/modules/User/user.service.ts
var registerUser = async (req) => {
  console.log("---req", req);
  const isUserExists = await User.findOne({
    email: req.body.email
  });
  if (isUserExists) {
    throw new appErrors_default(import_http_status3.default.CONFLICT, "Email already exists.");
  }
  const hashedPassword = await import_bcryptjs2.default.hash(req.body.password, Number(envVars.bcrypt_salt_rounds));
  const fileString = datauri_default(req.file?.buffer);
  const uploadFile = await cloudinary_default.uploader.upload(fileString, {
    folder: "nahida-assets"
  });
  const userData = {
    ...req.body,
    avatar: {
      public_id: uploadFile.public_id,
      url: uploadFile.secure_url
    },
    password: hashedPassword,
    role: "CUSTOMER" /* CUSTOMER */,
    provider: "CREDENTIALS" /* CREDENTIALS */,
    status: "ACTIVE" /* ACTIVE */,
    isVerified: false,
    addresses: []
  };
  const user = await User.create(userData);
  const result = await User.findById(user._id).select("-password");
  return result;
};
var allUsers = async () => {
  const users = await User.find();
  return users;
};

// src/app/modules/User/user.controller.ts
var import_http_status4 = __toESM(require("http-status"));
var registerUser2 = catchAsync(async (req, res) => {
  const result = await registerUser(req);
  sendResponse(res, {
    success: true,
    statusCode: import_http_status4.default.CREATED,
    message: "User registered successfully.",
    data: result
  });
});
var allUsers2 = catchAsync(async (req, res) => {
  const result = await allUsers();
  sendResponse(res, {
    success: true,
    statusCode: import_http_status4.default.OK,
    message: "User login successfully.",
    data: result
  });
});

// src/app/helper/multer.confic.ts
var import_multer = __toESM(require("multer"));
var upload = import_multer.default({
  storage: import_multer.default.memoryStorage()
});
var multer_confic_default = upload;

// src/app/modules/User/user.router.ts
var router = import_express2.default.Router();
router.post("/register", multer_confic_default.array("file", 5), validateRequest(createUserValidationSchema), registerUser2);
router.get("/all", allUsers2);
var UserRoutes = router;

// src/app/routes/routes.ts
var routes = import_express3.Router();
var moduleRoutes = [
  {
    path: "/auth",
    route: authRoute
  },
  {
    path: "/user",
    route: UserRoutes
  }
];
moduleRoutes.forEach((route2) => {
  routes.use(route2.path, route2.route);
});

// src/app.ts
var import_cors = __toESM(require("cors"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_express_session = __toESM(require("express-session"));

// src/app/middlewares/glovalErrHandler.ts
var globalErrHandler = (err, req, res, next) => {
  if (envVars.node_env === "development") {}
  let errorSources = [];
  let status = 500;
  let message = `something went wrong ${err.message}`;
  if (err.name === "ValidationError") {
    status = 400;
    const errors = Object.values(err.errors);
    errors.forEach((errObj) => errorSources.push({
      path: errObj.path,
      message: errObj.message
    }));
  } else if (err.name === "ZodError") {
    status = 400;
    message = "ZodError";
    err.issues.forEach((issue) => errorSources.push({
      path: issue.path[0],
      message: issue.message
    }));
  } else if (err.name === "CastError") {
    status = 400, message = "Please provide valid id";
  } else if (err.code === 11000) {
    const dublicate = err.message.match(/"([^"]*)" /);
    status = 400, message = `${dublicate[1]} already exists`;
  } else if (err instanceof appErrors_default) {
    status = err.statusCode, message = err.message;
  } else if (err instanceof Error) {
    status = 500, message = err.message;
  }
  res.status(status).json({
    success: false,
    message,
    err: envVars.node_env === "development" ? err : null,
    errorSources,
    stack: envVars.node_env === "development" ? err.stack : null
  });
};

// src/app.ts
var import_http_status5 = __toESM(require("http-status"));
var app = import_express4.default();
app.use(import_express4.default.json());
app.use(import_express4.default.urlencoded({ extended: true }));
app.use(import_cookie_parser.default());
app.use(import_express_session.default({
  secret: "your secret",
  resave: false,
  saveUninitialized: false
}));
app.use(import_cors.default({
  origin: ["http://localhost:5173", "https://assignment-6-neon-eight.vercel.app"],
  credentials: true
}));
app.use("/api/v1", routes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use((req, res) => {
  res.status(import_http_status5.default.NOT_FOUND).json({
    success: false,
    message: "Page not fount"
  });
});
app.use(globalErrHandler);
var app_default = app;

// src/server.ts
var server;
var port = 5000;
var startServer = async () => {
  await import_mongoose2.default.connect(envVars.DB_URL);
  console.log("mongodb connected successfully");
  server = app_default.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
(async () => {
  await startServer();
})();
process.on("SIGTERM", () => {
  console.log("sigtern is recieved and shutting down our server..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT SIGNAL is recieved and shutting down our server..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("unhandleRejection error is detected", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("uncaughtException error is detected", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//# debugId=B96E3391B84EB1CA64756E2164756E21
