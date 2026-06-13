export function successResponse<T>(data: T, status = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function errorResponse(error: string, status = 400) {
  return new Response(JSON.stringify({ success: false, error }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
