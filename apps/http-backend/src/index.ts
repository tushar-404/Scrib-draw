import express from "express";
import jwt from "jsonwebtoken";
import { SigninSchema, SignupSchema } from "./auth.schema";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { authMiddleware } from "./middleware";

/**
db is not connected yet
no auth check is happening 
TODO : will do these later
*/

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/auth/signup", (req, res) => {
  const data = req.body;
  try {
    const user = SignupSchema.parse(data);
    const payload = { username: user.username, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    });

    res.json(`signed up`);
  } catch (e) {
    res.json(`sign up failed`);
  }
});

app.post("/auth/signin", (req, res) => {
  const data = SigninSchema.parse(req.body);
  // adding security check later
  const payload = { username: data.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "2d" });

  res.cookie("token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
  });

  res.json({ message: "signed in" });
});
app.get("/auth/check", authMiddleware, (req, res) => {
  res.json({ loggedIn: true, user: (req as any).user });
});

app.get('/room')
app.listen(3001);

