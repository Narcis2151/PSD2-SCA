import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync('src\\private.pem', 'utf8').replace(
  /\\n/g,
  "\n"
);
const publicKey = fs.readFileSync('src\\public.pem', 'utf8').replace(
  /\\n/g,
  "\n"
);

export function signJwt(payload: Object, options: jwt.SignOptions | undefined) {
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
