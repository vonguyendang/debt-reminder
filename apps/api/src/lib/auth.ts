export async function signToken(payload: any, secret: string): Promise<string> {
  const data = btoa(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sigHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${data}.${sigHex}`;
}

export async function verifyToken(token: string, secret: string): Promise<any | null> {
  try {
    const [data, sigHex] = token.split('.');
    if (!data || !sigHex) return null;
    
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const sigBytes = new Uint8Array(sigHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
    if (!isValid) return null;
    
    const payload = JSON.parse(atob(data));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

export async function requireAuth(request: Request, env: any) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  const secret = env.AUTH_SECRET || 'fallback_secret_for_local_dev';
  return await verifyToken(token, secret);
}
