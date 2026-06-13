export type RequestHandler = (request: Request, env: any, ctx: any, params: Record<string, string>) => Promise<Response> | Response;

interface Route {
  method: string;
  pattern: URLPattern;
  handler: RequestHandler;
}

export class Router {
  public routes: Route[] = [];

  add(method: string, path: string, handler: RequestHandler) {
    this.routes.push({
      method: method.toUpperCase(),
      pattern: new URLPattern({ pathname: path }),
      handler
    });
  }

  get(path: string, handler: RequestHandler) { this.add('GET', path, handler); }
  post(path: string, handler: RequestHandler) { this.add('POST', path, handler); }
  put(path: string, handler: RequestHandler) { this.add('PUT', path, handler); }
  delete(path: string, handler: RequestHandler) { this.add('DELETE', path, handler); }

  mount(router: Router) {
    this.routes.push(...router.routes);
  }

  async handle(request: Request, env: any, ctx: any): Promise<Response> {
    const url = request.url;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    for (const route of this.routes) {
      if (route.method === method || route.method === 'ALL') {
        const match = route.pattern.exec(url);
        if (match) {
          console.log(`Matched route: ${route.method} ${url}`);
          try {
            const response = await route.handler(request, env, ctx, match.pathname.groups as Record<string, string>);
            const newHeaders = new Headers(response.headers);
            newHeaders.set('Access-Control-Allow-Origin', '*');
            return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: newHeaders
            });
          } catch (e: any) {
            console.error("Route error:", e);
            return new Response(JSON.stringify({ success: false, error: e.message || "Internal Server Error" }), {
              status: 500,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
          }
        }
      }
    }

    console.log(`404 Not Found: ${method} ${url}`);
    console.log(`Available routes: ${this.routes.map(r => r.method + ' ' + r.pattern.pathname).join(', ')}`);

    return new Response(JSON.stringify({ success: false, error: "Not found" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
