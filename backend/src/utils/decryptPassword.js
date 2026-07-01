import crypto from "crypto";
import fs from "fs";

const privateKey = fs.readFileSync("private.pem", "utf8");

export const decryptPassword = (encrypted) => {
  const buffer = Buffer.from(encrypted, "base64");

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer
  );

  return decrypted.toString("utf8");
}