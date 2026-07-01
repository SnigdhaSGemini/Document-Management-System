import forge from "node-forge";

export const encryptPassword = (password, publicKeyPem) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  const encrypted = publicKey.encrypt(password, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });

  return forge.util.encode64(encrypted);
}