import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
} from "@auth0/nextjs-auth0";

import type { AfterCallback } from "@auth0/nextjs-auth0";
import { AUTH0_AUDIENCE } from "../../../../config";

const afterCallback: AfterCallback = (req, res, session, state) => {
  if (!session.user) {
    throw new Error("User is not logged in");
  }
  return session;
};

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          custom_param: "custom",
          scope: "openid email profile offline_access",
          audience: `${AUTH0_AUDIENCE}`,
          // organization: process.env.TENANT_ORGANIZATION_ID,
        },
        returnTo: "/",
      });
    } catch (error) {
      if (error instanceof Error) {
        // Add your own custom error handling
        console.log(error);
        res.status(400).end(error.message);
      }
    }
  },
  async logout(req, res) {
    console.log("logout");
    try {
      await handleLogout(req, res, {
        returnTo: "/api/auth/login",
      });
    } catch (error) {
      if (error instanceof Error) {
        // Add your own custom error handling
        res.status(400).end(error.message);
      }
    }
  },
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).end(error.message);
        // if (error.status === 400) {
        //   res.redirect("/api/auth/login");
        // } else {
        //   res.status(error.status || 500).end(error.message);
        // }
      }
    }
  },
});
