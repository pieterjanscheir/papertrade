import { NextResponse, type NextRequest } from "next/server";

/**
 * Site-wide password gate.
 *
 * Set SITE_PASSWORD (e.g. in .env.local or your host's env settings) to lock the
 * whole site behind one shared password. Leave it unset to turn the gate off.
 * After a correct password the browser gets an httpOnly cookie holding a hash
 * of the password (never the password itself), valid for 30 days. Changing the
 * password logs everyone out.
 */

const COOKIE = "papertrade-gate";
const UNLOCK_PATH = "/__unlock";
const MAX_AGE = 60 * 60 * 24 * 30;

async function tokenFor(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`papertrade-gate:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Only allow same-site relative paths as the place to go after unlocking. */
function safeNext(value: unknown): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : "/";
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function loginPage(next: string, error: boolean): NextResponse {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Papertrade · Locked</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#08090c;color:#f3f4f6;font:15px/1.5 system-ui,-apple-system,"Segoe UI",Inter,sans-serif;padding:24px}
  .card{width:100%;max-width:380px;background:#111318;border:1px solid #23262f;border-radius:24px;padding:32px}
  .coin{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:22px;color:#1a1406;background:radial-gradient(circle at 30% 30%,#ffe08a,#f5c04a 55%,#b8862a);box-shadow:0 8px 30px rgba(245,192,74,.25);margin-bottom:20px}
  h1{margin:0 0 4px;font-size:22px;letter-spacing:-.01em}
  p{margin:0 0 24px;color:#8b90a0;font-size:14px}
  label{display:block;font-size:12px;color:#8b90a0;margin-bottom:6px}
  input{width:100%;padding:12px 14px;border-radius:14px;border:1px solid #23262f;background:#08090c;color:inherit;font:inherit;outline:none}
  input:focus{border-color:#f5c04a}
  button{margin-top:16px;width:100%;padding:12px;border:0;border-radius:999px;background:#f5c04a;color:#1a1406;font:inherit;font-weight:700;cursor:pointer}
  button:hover{filter:brightness(1.08)}
  .err{margin:12px 0 0;color:#ff5c6c;font-size:13px}
  .foot{margin-top:20px;font-size:11px;color:#5d6270;text-align:center}
</style>
</head>
<body>
  <form class="card" method="post" action="${UNLOCK_PATH}">
    <div class="coin">P</div>
    <h1>Papertrade</h1>
    <p>This hackathon sandbox is password protected. Ask the organisers for the password.</p>
    <label for="pw">Password</label>
    <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required />
    <input type="hidden" name="next" value="${escapeHtml(next)}" />
    ${error ? '<p class="err">That’s not it. Try again.</p>' : ""}
    <button type="submit">Enter</button>
    <div class="foot">Simulated prices · play money only</div>
  </form>
</body>
</html>`;
  return new NextResponse(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  const token = await tokenFor(password);
  const { pathname, search } = request.nextUrl;

  if (pathname === UNLOCK_PATH && request.method === "POST") {
    const form = await request.formData().catch(() => null);
    const next = safeNext(form?.get("next"));
    const attempt = form?.get("password");
    if (typeof attempt === "string" && (await tokenFor(attempt)) === token) {
      const res = NextResponse.redirect(new URL(next, request.url), 303);
      res.cookies.set(COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
        path: "/",
        maxAge: MAX_AGE,
      });
      return res;
    }
    return loginPage(next, true);
  }

  if (request.cookies.get(COOKIE)?.value === token) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Password required" }, { status: 401 });
  }
  return loginPage(safeNext(pathname === UNLOCK_PATH ? "/" : pathname + search), false);
}

export const config = {
  // Everything except build assets and the favicon (so the lock screen can show it).
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
