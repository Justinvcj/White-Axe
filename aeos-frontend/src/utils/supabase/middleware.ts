import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect internal routes
  if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    // Fetch user role for proper routing - using maybeSingle() to prevent PGRST116 crashes if profile is missing
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    const role = profile?.role?.toLowerCase() || '';
    if (role === 'teacher') url.pathname = '/teacher';
    else if (role === 'student') url.pathname = '/student';
    else if (role === 'parent') url.pathname = '/parent';
    else if (role === 'admin') url.pathname = '/admin';
    else if (role === 'superadmin') url.pathname = '/superadmin';
    else url.pathname = '/student/dashboard'; // Break E2E loop!
    
    // Explicitly copy cookies to the redirect response to prevent infinite loops
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    
    return redirectResponse;
  }

  return supabaseResponse;
}
