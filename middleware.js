import { NextResponse } from "next/server";

export default function middleware(req) {
  const verify = req.cookies.get("logedin");
  const url = req.nextUrl.clone();

  if (
    !verify &&
    (url.pathname.includes("/dashboard") ||
      url.pathname.includes("/form") ||
      url.pathname.includes("/register"))
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (verify && url.pathname === "/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
