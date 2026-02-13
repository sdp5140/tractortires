export default function middleware(request) {
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    const [, encoded] = basicAuth.split(' ');
    const [user, pwd] = atob(encoded).split(':');

    if (user === 'admin' && pwd === 'tractor-tire-2026!') {
      return;
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Tractor Tires"',
    },
  });
}

export const config = {
  matcher: '/(.*)',
};
