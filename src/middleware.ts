import { type NextRequest, NextResponse } from "next/server";

// Valid date param pattern: YYYY-MM-DD
const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Template/bot probe strings that should never be indexed
const TEMPLATE_PATTERN = /[{}\[\]<>\\|^`]/;

// /ngay-tot-xau/{slug} where slug is NOT a 4-digit year → redirect to /ngay-tot-xau-{slug}
const NTX_SLUG = /^\/ngay-tot-xau\/([a-z][a-z0-9-]*)$/;

export function middleware(req: NextRequest) {
  const { pathname, searchParams, origin } = req.nextUrl;

  // /ngay-tot-xau/{activity-slug} → /ngay-tot-xau-{activity-slug}
  const ntxMatch = NTX_SLUG.exec(pathname);
  if (ntxMatch) {
    const slug = ntxMatch[1];
    const query = searchParams.toString();
    return NextResponse.redirect(`${origin}/ngay-tot-xau-${slug}${query ? `?${query}` : ""}`, { status: 301 });
  }

  // Only apply date-param logic to homepage
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
  matcher: ["/", "/ngay-tot-xau/:slug"],
};
