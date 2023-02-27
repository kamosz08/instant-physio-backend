import passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";

import {usersService} from "../services/users";

const { JWT_SECRET } = process.env;

// Create a new instance of the JWT Passport.js strategy
const strategy = new Strategy(
  // Pass an object literal as the first argument
  // to new Strategy to control how a token is extracted from the request
  {
    // Extract the 'bearer' token from the authorization header,
    // where the encoded JWT string is stored
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // A string for verifying the token's signature
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    try {
      // jwtPayload contains the decoded JWT payload,
      // which includes the user's id
      // Find that user in the database
      const user = await usersService.findById({ id: jwtPayload.id });

      if (!user) {
        const err = new Error("User not found");
        // err.statusCode = 404;
        throw err;
      }

      // done is an error-first callback with signature done(error, user, info)
      // pass the found user to the route handler
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

// Register the strategy configured above so that Passport.js can use it authentication
passport.use(strategy);

// A middleware for initializing passport
const initialize = () => {
  return passport.initialize();
};

// Add this middleware to privileged routes later on
const authenticate = () => {
  return passport.authenticate("jwt", { session: false });
};

export {
  initialize,
  authenticate,
};