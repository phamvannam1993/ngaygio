import { type NextRequest, NextResponse } from "next/server";

// Valid date param pattern: YYYY-MM-DD
const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Template/bot probe strings that should never be indexed
const TEMPLATE_PATTERN = /[{}\[\]<>\\|^`]/;

export function middleware(req: NextRequest) {
  const { pathname, searchParams, origin } = req.nextUrl;

  // Only apply to homepage
  if (pathname !== "/") return NextResponse.next();

  const date = searchParams.get("date");

  // No date param — fine
  if (!date) return NextResponse.next();

  // Valid date — fine
  if (VALID_DATE.test(date)) return NextResponse.next();

  // Template string (e.g. {search_term_string}) — 410 Gone, tell Google to stop crawling
  if (TEMPLATE_PATTERN.test(date)) {
    return new NextResponse("Gone", { status: 410 });
  }

  // Other invalid date — 301 to clean homepage
  return NextResponse.redirect(`${origin}/`, { status: 301 });
}

export const config = {
  matcher: ["/"],
};
