const jsonServer = require("json-server");
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({ noCors: true });
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const jwt = require("jsonwebtoken");
const AUTH_JWT_SECRET = "TOP-SECRET";
const AUTH_JWT_REFRESH_TOKEN_SECRET = "REFRESH_TOKEN_TOP-SECRET";
const AUTH_JWT_OPTIONS = { expiresIn: 60 * 60 };
const refreshTokenExpire = "1d";
const accessTokenExpire = "1h";

// TODO: vaghti token nis, 200 mide
// TODO: vaghti token nist, invalid nade (login api)
// TODO: besorat pishfarz token baraye har api niaz nabashe vali baraye ye seri api niaz bash be sorat dasti set she
// TODO: Handle 404 error message
// TODO: Refactor refresh token mechanism

// Load DB file for Authentication middleware and endpoints
const DB = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./db.json"), "utf-8")
);

server.use(cors());

// Authorization Middleware
server.use((req, res, next) => {
  const protections = DB.protection || {};
  const entity = req.url.split("/")[1];
  const entityProtection = protections[entity];
  const methodSpecificProtection =
    protections[entity + "." + req.method.toLowerCase()];
  const protectionRule =
    methodSpecificProtection === false
      ? false
      : methodSpecificProtection || entityProtection;

  const token = req.headers.token || req.headers.Token;
  if (protectionRule && !token) return res.status(401).send();
  if (!token) return next();

  jwt.verify(token, AUTH_JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("res: ", JSON.stringify(err));

      return res
        .status(401)
        .send(
          err.name === "TokenExpiredError" ? "Token Expired!" : "Invalid Token"
        );
    }
    req.user = decoded;
    if (!protectionRule) return next(); // no authorization is needed
    const authorized =
      protectionRule === true || protectionRule === decoded.role;
    if (!authorized) return res.status(401).send();
    next(); // authorized
  });
});

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// general upload API (for test)
server.post("/upload", upload.single("image"), function (req, res, next) {
  // req.file is the `image` file
  // req.body will hold the text fields, if there were any
  res.json(req.file);
});

// list all files API (for test)
server.get("/files", (req, res, next) => {
  fs.readdir("./uploads/", (err, files) => {
    if (err) return next(err);
    res.json(files);
  });
});

// download (preview) a file API
server.get("/files/:file_id", (req, res, next) => {
  const { file_id } = req.params;
  res.set("Content-Type", "image/jpeg");
  res.sendFile(path.join(__dirname, "uploads/" + file_id));
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// For all non-json POST and PATCH requests (create and edit endpoints using an image file)
// 1- Upload the file inside the `image` field
// 2- (do it in next middleware)
const imageFieldUploadMiddleware = upload.single("image");

server.use((req, res, next) => {
  if (
    (req.method === "POST" || req.method === "PATCH") &&
    req.headers["content-type"] != "application/json"
  ) {
    imageFieldUploadMiddleware(req, res, next);
  } else {
    next();
  }
});

// If previous middle-ware worked, continue to next step
// 1- (previous middle-ware already did first step)
// 2- Validate uploaded file, and replace the `image` field value with the file path
server.use((req, res, next) => {
  // if there was a file uploaded and previous middleware worked:
  //   req.file is the `image` file
  //   req.body will hold the text fields, if there were any
  if (req.file) {
    const { mimetype, size, filename } = req.file;

    // validate uploaded image
    if (mimetype != "image/jpeg")
      throw new Error("image should be in image/jpeg type");
    if (size > 2 * 1024 * 1024)
      throw new Error("image size should be less than 2MB");

    // Replace image field value with the file's path
    req.body.image = "/files/" + filename;
  }
  // continue to normal json-server router for actual creation
  next();
});

// Add createdAt field with timestamp value when posting to any route
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

let refreshTokens = [];
// Authentication Routes
server.post("/auth/login", async function (req, res, next) {
  const { username, password } = req.body;
  req.user = (DB.users || {}).find(
    (u) => u.username == username && u.password == password
  );
  if (!req.user) return res.status(401).send("No user with those credentials!");
  const { username: dbUsername, role, name } = req.user;
  const accessToken = await jwt.sign(
    { dbUsername, role, name },
    AUTH_JWT_SECRET,
    {
      expiresIn: accessTokenExpire,
    }
  );
  const refreshToken = await jwt.sign(
    { dbUsername, role, name },
    AUTH_JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: refreshTokenExpire,
    }
  );
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

server.post("/auth/refresh-token", async function (req, res, next) {
  const refreshToken = req.header("refreshToken");
  console.log(refreshToken);

  if (!refreshToken) {
    return res.status(403).json({
      errors: [
        {
          msg: "Token not found",
        },
      ],
    });
  }

  // If token does not exist, send error message
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({
      errors: [
        {
          msg: "Invalid refresh token",
        },
      ],
    });
  }

  try {
    const user = await jwt.verify(refreshToken, AUTH_JWT_REFRESH_TOKEN_SECRET);
    const { dbUsername, name, role } = user;
    const accessToken = await jwt.sign(
      { dbUsername, name, role },
      AUTH_JWT_SECRET,
      { expiresIn: accessTokenExpire }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({
      errors: [
        {
          msg: "Invalid token",
        },
      ],
    });
  }
});

// Public visitors can read approved comments and submit comments for review.
// Only administrators can inspect hidden comments or change their status.
server.get("/comments", (req, res) => {
  const isAdmin = req.user?.role === "admin";
  const productId = Number(req.query.productId);
  const allComments = router.db.get("comments").value() || [];

  if (!isAdmin && !Number.isInteger(productId)) {
    return res.status(400).json({ message: "A productId is required." });
  }

  const requestedStatus = ["pending", "approved", "rejected"].includes(
    String(req.query.status)
  ) ? String(req.query.status) : undefined;

  const comments = allComments
    .filter((comment) => !Number.isInteger(productId) || comment.productId === productId)
    .filter((comment) => isAdmin
      ? !requestedStatus || comment.status === requestedStatus
      : comment.status === "approved")
    .sort((a, b) => b.createdAt - a.createdAt);

  return res.json(comments);
});

server.post("/comments", (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
  const productId = Number(req.body.productId);
  const rating = Number(req.body.rating);
  const product = router.db.get("products").find({ id: productId }).value();

  if (!product || name.length < 2 || name.length > 60 || body.length < 5 || body.length > 1000 ||
      !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "A valid product, name, comment, and rating are required.",
    });
  }

  const comments = router.db.get("comments").value() || [];
  const comment = {
    id: comments.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1,
    productId,
    name,
    body,
    rating,
    status: "pending",
    createdAt: Date.now(),
  };

  router.db.get("comments").push(comment).write();
  return res.status(201).json(comment);
});

// Use default router (CRUDs of db.json)
server.use(router);

server.listen(3002, () => {
  console.log("Customized JSON-Server is running at http://localhost:3002/");
});
