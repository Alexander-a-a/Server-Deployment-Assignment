const db = require("../models");
const AdminService = require("../services/AdminService");
const adminService = new AdminService(db);

async function isAuth(req, res, next) {
  const auth = req.headers.authorization;

  const basic = "Basic ";

  if (!auth) {
    const err = new Error("Header is required!");
    err.httpStatus = 401;
    err.code = "APP_BAD_REQUEST";
    throw err;
  }

  if (!auth.startsWith(basic)) {
    const err = new Error("Wrong Auth type!");
    err.httpStatus = 401;
    err.code = "APP_BAD_REQUEST";
    throw err;
  }

  
    const cleanHeader = auth.replace(basic, '');

    const decodedHeader = Buffer.from(cleanHeader, 'base64');
    const readableHeader = decodedHeader.toString('utf-8');

    const splitHeader = readableHeader.split(':');

    if (splitHeader.length < 2) {
        const err = new Error("Missing item in payload");
        err.httpStatus = 401;
        err.code = "APP_BAD_REQUEST";
        throw err;
    }

    const username = splitHeader[0];
    const password = splitHeader[1];

    if (username.trim().length <= 0) {
        const err = new Error("Username cannot be empty");
        err.httpStatus = 401;
        err.code = "APP_BAD_REQUEST";
        throw err;
    }

    if (password.trim().length <= 0) {
        const err = new Error("Password cannot be empty");
        err.httpStatus = 401;
        err.code = "APP_BAD_REQUEST";
        throw err;
    }

    const authCheck = await adminService.validateCredentials(username, password);
    if (!authCheck) {
        const err = new Error("Invalid username or password");
        err.httpStatus = 401;
        err.code = "APP_BAD_REQUEST";
        throw err;
    }

        next();
}

module.exports = isAuth;
