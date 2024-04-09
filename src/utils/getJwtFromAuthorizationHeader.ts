export function getJwtFromAuthorizationHeader(
  authorizationHeader: string,
): string {
  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer !== 'Bearer') {
    throw new Error('Invalid authorization header');
  }

  return token;
}
