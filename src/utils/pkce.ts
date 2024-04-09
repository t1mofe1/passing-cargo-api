import * as crypto from 'crypto';

export type PkcePayload = {
  code_verifier: string;
  code_challenge: string;
  code_challenge_method: 'S256';
};

export default function generatePKCE(length = 128): PkcePayload {
  if (length < 43) length = 43;
  if (length > 128) length = 128;

  const bytesLength = Math.ceil((length * 3) / 4);

  const code_verifier = crypto.randomBytes(bytesLength).toString('base64url');

  const code_challenge = crypto
    .createHash('sha256')
    .update(code_verifier)
    .digest()
    .toString('base64url');

  return {
    code_verifier,
    code_challenge,
    code_challenge_method: 'S256', // TODO: support plain?
  };
}
