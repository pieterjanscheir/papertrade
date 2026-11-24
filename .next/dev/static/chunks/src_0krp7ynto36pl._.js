(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/app-providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProviders",
    ()=>AppProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@24.19.2_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@24.19.2_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/trading/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/logo.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AppProviders({ children }) {
    _s();
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProviders.useEffect": ()=>{
            let cancelled = false;
            Promise.resolve(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccountStore"].persist.rehydrate()).then({
                "AppProviders.useEffect": ()=>{
                    if (cancelled) return;
                    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccountStore"].getState().account) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAccountStore"].getState().reset("demo");
                    setReady(true);
                }
            }["AppProviders.useEffect"]);
            return ({
                "AppProviders.useEffect": ()=>{
                    cancelled = true;
                }
            })["AppProviders.useEffect"];
        }
    }["AppProviders.useEffect"], []);
    // Pages always render (Next.js validates them), but stay hidden behind a splash
    // until the account is loaded from localStorage.
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            !ready && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 grid place-items-center bg-bg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logo"], {
                        size: 44
                    }, void 0, false, {
                        fileName: "[project]/src/components/app-providers.tsx",
                        lineNumber: 33,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/app-providers.tsx",
                    lineNumber: 32,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/app-providers.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: ready ? undefined : "invisible",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/app-providers.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/app-providers.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(AppProviders, "KuazqYXqOk+6VRk8yHVvoClyoeE=");
_c = AppProviders;
var _c;
__turbopack_context__.k.register(_c, "AppProviders");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/app-shell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@24.19.2_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@24.19.2_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@24.19.2_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$79$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.79.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/activity.mjs [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$79$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.79.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/compass.mjs [app-client] (ecmascript) <export default as Compass>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$79$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.79.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/house.mjs [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$79$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.79.0_@types+react@19.3.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/user-round.mjs [app-client] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/market/provider.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/logo.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const NAV = [
    {
        href: "/",
        label: "Home",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$79$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        href: "/markets",
        label: "Invest",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$79$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"]
    },
    {
        href: "/activity",
        label: "Activity",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$79$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"]
    },
    {
        href: "/account",
        label: "Account",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$79$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"]
    }
];
function isActive(pathname, href) {
    if (href === "/") return pathname === "/";
    if (href === "/markets") return pathname.startsWith("/markets") || pathname.startsWith("/asset");
    return pathname.startsWith(href);
}
function AppShell({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto flex min-h-dvh max-w-6xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-8 border-r border-line px-5 py-7 md:flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "px-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Logo"], {
                            withText: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/app-shell.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex flex-col gap-1",
                        children: NAV.map(({ href, label, icon: Icon })=>{
                            const active = isActive(pathname, href);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: href,
                                className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface hover:text-fg"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        size: 18,
                                        strokeWidth: active ? 2.4 : 2
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/app-shell.tsx",
                                        lineNumber: 43,
                                        columnNumber: 17
                                    }, this),
                                    label
                                ]
                            }, href, true, {
                                fileName: "[project]/src/components/app-shell.tsx",
                                lineNumber: 36,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/app-shell.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto rounded-2xl border border-line bg-surface p-4 text-xs leading-relaxed text-muted",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mb-1 flex items-center gap-1.5 font-medium text-fg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "size-1.5 animate-pulse rounded-full bg-gain"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/app-shell.tsx",
                                        lineNumber: 51,
                                        columnNumber: 13
                                    }, this),
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["market"].sourceLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/app-shell.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this),
                            "Play money only. Nothing here is real market data or investment advice."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/app-shell.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/app-shell.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "min-w-0 flex-1 px-4 pt-5 pb-28 md:px-10 md:pt-8 md:pb-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-3xl",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/app-shell.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/app-shell.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto grid max-w-md grid-cols-4",
                    children: NAV.map(({ href, label, icon: Icon })=>{
                        const active = isActive(pathname, href);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            className: `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active ? "text-fg" : "text-muted"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    size: 22,
                                    strokeWidth: active ? 2.4 : 1.8
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 75,
                                    columnNumber: 17
                                }, this),
                                label
                            ]
                        }, href, true, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 68,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/components/app-shell.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/app-shell.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/app-shell.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(AppShell, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppShell;
var _c;
__turbopack_context__.k.register(_c, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/logo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Logo",
    ()=>Logo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.4.6_@babel+core@7.29.13_@types+node@24.19.2_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function Logo({ size = 32, withText = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-2.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "grid place-items-center rounded-[30%] bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/20",
                style: {
                    width: size,
                    height: size
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    viewBox: "0 0 24 24",
                    width: size * 0.55,
                    height: size * 0.55,
                    fill: "none",
                    "aria-hidden": true,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M3 17l5-5 4 4 8-9",
                        stroke: "white",
                        strokeWidth: "2.6",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/logo.tsx",
                        lineNumber: 9,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/logo.tsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/logo.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            withText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$4$2e$6_$40$babel$2b$core$40$7$2e$29$2e$13_$40$types$2b$node$40$24$2e$19$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-lg font-semibold tracking-tight",
                children: "papertrade"
            }, void 0, false, {
                fileName: "[project]/src/components/logo.tsx",
                lineNumber: 12,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/logo.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = Logo;
var _c;
__turbopack_context__.k.register(_c, "Logo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/market/assets.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * The tradable universe.
 *
 * Names and tickers refer to real instruments so the app feels familiar, but every
 * price in this app is SIMULATED (see `simulator.ts`). `refPrice` is only a rough
 * anchor so numbers look plausible; nothing here is real market data.
 *
 * Hackathon tip: add assets here, or replace this list with data from a provider
 * (see `provider.ts`).
 */ __turbopack_context__.s([
    "ASSETS",
    ()=>ASSETS,
    "ASSETS_BY_SYMBOL",
    ()=>ASSETS_BY_SYMBOL,
    "ASSET_TYPE_LABEL",
    ()=>ASSET_TYPE_LABEL,
    "getAsset",
    ()=>getAsset
]);
const ASSETS = [
    // --- US tech ---
    {
        symbol: "AAPL",
        name: "Apple",
        type: "stock",
        sector: "Technology",
        exchange: "NASDAQ",
        refPrice: 215,
        volatility: 0.26,
        drift: 0.09,
        color: "#8e8e93",
        description: "Consumer electronics, software and services, best known for the iPhone and Mac."
    },
    {
        symbol: "MSFT",
        name: "Microsoft",
        type: "stock",
        sector: "Technology",
        exchange: "NASDAQ",
        refPrice: 410,
        volatility: 0.24,
        drift: 0.1,
        color: "#00a4ef",
        description: "Software, cloud computing (Azure) and productivity tools."
    },
    {
        symbol: "NVDA",
        name: "NVIDIA",
        type: "stock",
        sector: "Semiconductors",
        exchange: "NASDAQ",
        refPrice: 125,
        volatility: 0.48,
        drift: 0.18,
        color: "#76b900",
        description: "Graphics processors and accelerated computing chips used for AI workloads."
    },
    {
        symbol: "AMZN",
        name: "Amazon",
        type: "stock",
        sector: "Consumer",
        exchange: "NASDAQ",
        refPrice: 190,
        volatility: 0.3,
        drift: 0.1,
        color: "#ff9900",
        description: "E-commerce marketplace and the AWS cloud platform."
    },
    {
        symbol: "GOOGL",
        name: "Alphabet",
        type: "stock",
        sector: "Technology",
        exchange: "NASDAQ",
        refPrice: 165,
        volatility: 0.28,
        drift: 0.09,
        color: "#4285f4",
        description: "Parent company of Google Search, YouTube and Google Cloud."
    },
    {
        symbol: "META",
        name: "Meta Platforms",
        type: "stock",
        sector: "Technology",
        exchange: "NASDAQ",
        refPrice: 520,
        volatility: 0.36,
        drift: 0.11,
        color: "#0866ff",
        description: "Social networks and messaging apps, plus VR/AR hardware."
    },
    {
        symbol: "TSLA",
        name: "Tesla",
        type: "stock",
        sector: "Automotive",
        exchange: "NASDAQ",
        refPrice: 230,
        volatility: 0.6,
        drift: 0.06,
        color: "#e82127",
        description: "Electric vehicles, batteries and energy storage."
    },
    {
        symbol: "NFLX",
        name: "Netflix",
        type: "stock",
        sector: "Media",
        exchange: "NASDAQ",
        refPrice: 640,
        volatility: 0.38,
        drift: 0.08,
        color: "#e50914",
        description: "Subscription video streaming."
    },
    {
        symbol: "AMD",
        name: "Advanced Micro Devices",
        type: "stock",
        sector: "Semiconductors",
        exchange: "NASDAQ",
        refPrice: 150,
        volatility: 0.5,
        drift: 0.12,
        color: "#ed1c24",
        description: "CPUs and GPUs for PCs, data centres and consoles."
    },
    {
        symbol: "SPOT",
        name: "Spotify",
        type: "stock",
        sector: "Media",
        exchange: "NYSE",
        refPrice: 330,
        volatility: 0.42,
        drift: 0.1,
        color: "#1db954",
        description: "Audio streaming for music and podcasts."
    },
    // --- US other ---
    {
        symbol: "KO",
        name: "Coca-Cola",
        type: "stock",
        sector: "Consumer Staples",
        exchange: "NYSE",
        refPrice: 58,
        volatility: 0.15,
        drift: 0.05,
        color: "#f40009",
        description: "Non-alcoholic beverages sold worldwide."
    },
    {
        symbol: "JPM",
        name: "JPMorgan Chase",
        type: "stock",
        sector: "Financials",
        exchange: "NYSE",
        refPrice: 190,
        volatility: 0.22,
        drift: 0.07,
        color: "#5b6b7a",
        description: "Global investment bank and consumer banking."
    },
    {
        symbol: "V",
        name: "Visa",
        type: "stock",
        sector: "Financials",
        exchange: "NYSE",
        refPrice: 255,
        volatility: 0.18,
        drift: 0.08,
        color: "#1a1f71",
        description: "Card payments network."
    },
    {
        symbol: "DIS",
        name: "Walt Disney",
        type: "stock",
        sector: "Media",
        exchange: "NYSE",
        refPrice: 95,
        volatility: 0.28,
        drift: 0.04,
        color: "#113ccf",
        description: "Entertainment studios, theme parks and streaming."
    },
    // --- Europe ---
    {
        symbol: "ASML",
        name: "ASML Holding",
        type: "stock",
        sector: "Semiconductors",
        exchange: "Euronext Amsterdam",
        refPrice: 820,
        volatility: 0.38,
        drift: 0.11,
        color: "#10069f",
        description: "Lithography machines used to manufacture advanced chips."
    },
    {
        symbol: "SAP",
        name: "SAP",
        type: "stock",
        sector: "Technology",
        exchange: "XETRA",
        refPrice: 185,
        volatility: 0.24,
        drift: 0.09,
        color: "#0070f2",
        description: "Enterprise resource planning and business software."
    },
    {
        symbol: "NOVO",
        name: "Novo Nordisk",
        type: "stock",
        sector: "Healthcare",
        exchange: "Copenhagen",
        refPrice: 110,
        volatility: 0.32,
        drift: 0.07,
        color: "#001965",
        description: "Pharmaceuticals focused on diabetes and obesity care."
    },
    {
        symbol: "MC",
        name: "LVMH",
        type: "stock",
        sector: "Luxury",
        exchange: "Euronext Paris",
        refPrice: 720,
        volatility: 0.27,
        drift: 0.06,
        color: "#a67c52",
        description: "Luxury goods group spanning fashion, wine & spirits and jewellery."
    },
    {
        symbol: "SIE",
        name: "Siemens",
        type: "stock",
        sector: "Industrials",
        exchange: "XETRA",
        refPrice: 170,
        volatility: 0.24,
        drift: 0.07,
        color: "#009999",
        description: "Industrial automation, infrastructure and digital industries."
    },
    {
        symbol: "ALV",
        name: "Allianz",
        type: "stock",
        sector: "Financials",
        exchange: "XETRA",
        refPrice: 260,
        volatility: 0.2,
        drift: 0.07,
        color: "#003781",
        description: "Insurance and asset management."
    },
    {
        symbol: "ADS",
        name: "Adidas",
        type: "stock",
        sector: "Consumer",
        exchange: "XETRA",
        refPrice: 205,
        volatility: 0.32,
        drift: 0.05,
        color: "#2b2b2b",
        description: "Sportswear, footwear and equipment."
    },
    {
        symbol: "RACE",
        name: "Ferrari",
        type: "stock",
        sector: "Automotive",
        exchange: "Borsa Italiana",
        refPrice: 390,
        volatility: 0.24,
        drift: 0.1,
        color: "#da291c",
        description: "Luxury sports cars and Formula 1."
    },
    {
        symbol: "ABI",
        name: "AB InBev",
        type: "stock",
        sector: "Consumer Staples",
        exchange: "Euronext Brussels",
        refPrice: 57,
        volatility: 0.24,
        drift: 0.04,
        color: "#c8a2c8",
        description: "The world's largest brewer."
    },
    {
        symbol: "KBC",
        name: "KBC Group",
        type: "stock",
        sector: "Financials",
        exchange: "Euronext Brussels",
        refPrice: 68,
        volatility: 0.24,
        drift: 0.06,
        color: "#00aeef",
        description: "Belgian bank-insurance group."
    },
    {
        symbol: "UCB",
        name: "UCB",
        type: "stock",
        sector: "Healthcare",
        exchange: "Euronext Brussels",
        refPrice: 150,
        volatility: 0.3,
        drift: 0.08,
        color: "#ff6b35",
        description: "Biopharma focused on immunology and neurology."
    },
    // --- ETFs ---
    {
        symbol: "VWCE",
        name: "FTSE All-World ETF",
        type: "etf",
        sector: "Global equity",
        exchange: "XETRA",
        refPrice: 120,
        volatility: 0.14,
        drift: 0.07,
        color: "#96151d",
        description: "Tracks thousands of large and mid-cap companies across developed and emerging markets."
    },
    {
        symbol: "IWDA",
        name: "MSCI World ETF",
        type: "etf",
        sector: "Developed markets",
        exchange: "Euronext Amsterdam",
        refPrice: 95,
        volatility: 0.14,
        drift: 0.075,
        color: "#000000",
        description: "Tracks large and mid-cap companies in developed markets."
    },
    {
        symbol: "CSPX",
        name: "S&P 500 ETF",
        type: "etf",
        sector: "US equity",
        exchange: "London",
        refPrice: 540,
        volatility: 0.16,
        drift: 0.085,
        color: "#3c3c3c",
        description: "Tracks the 500 largest US listed companies."
    },
    {
        symbol: "EQQQ",
        name: "Nasdaq-100 ETF",
        type: "etf",
        sector: "US tech",
        exchange: "XETRA",
        refPrice: 450,
        volatility: 0.22,
        drift: 0.1,
        color: "#0996c7",
        description: "Tracks the 100 largest non-financial Nasdaq companies."
    },
    {
        symbol: "EMIM",
        name: "Emerging Markets ETF",
        type: "etf",
        sector: "Emerging markets",
        exchange: "Euronext Amsterdam",
        refPrice: 32,
        volatility: 0.17,
        drift: 0.05,
        color: "#6d2077",
        description: "Tracks companies in emerging economies."
    },
    {
        symbol: "ESGW",
        name: "Clean Energy ETF",
        type: "etf",
        sector: "Thematic",
        exchange: "XETRA",
        refPrice: 8,
        volatility: 0.3,
        drift: 0.03,
        color: "#2e7d32",
        description: "Thematic basket of renewable-energy companies."
    },
    // --- Crypto ---
    {
        symbol: "BTC",
        name: "Bitcoin",
        type: "crypto",
        sector: "Crypto",
        exchange: "24/7",
        refPrice: 62000,
        volatility: 0.55,
        drift: 0.15,
        color: "#f7931a",
        description: "The first and largest cryptocurrency by market value."
    },
    {
        symbol: "ETH",
        name: "Ethereum",
        type: "crypto",
        sector: "Crypto",
        exchange: "24/7",
        refPrice: 3100,
        volatility: 0.65,
        drift: 0.12,
        color: "#627eea",
        description: "Programmable blockchain powering smart contracts."
    },
    {
        symbol: "SOL",
        name: "Solana",
        type: "crypto",
        sector: "Crypto",
        exchange: "24/7",
        refPrice: 150,
        volatility: 0.85,
        drift: 0.1,
        color: "#9945ff",
        description: "High-throughput blockchain for apps and payments."
    }
];
const ASSETS_BY_SYMBOL = Object.fromEntries(_c1 = ASSETS.map(_c = (a)=>[
        a.symbol,
        a
    ]));
_c2 = ASSETS_BY_SYMBOL;
function getAsset(symbol) {
    return ASSETS_BY_SYMBOL[symbol.toUpperCase()];
}
const ASSET_TYPE_LABEL = {
    stock: "Stocks",
    etf: "ETFs",
    crypto: "Crypto"
};
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ASSETS_BY_SYMBOL$Object.fromEntries$ASSETS.map");
__turbopack_context__.k.register(_c1, "ASSETS_BY_SYMBOL$Object.fromEntries");
__turbopack_context__.k.register(_c2, "ASSETS_BY_SYMBOL");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/market/provider.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "market",
    ()=>market,
    "simulatedMarket",
    ()=>simulatedMarket
]);
/**
 * The single seam between the UI and market data.
 *
 * Every screen reads prices through `market`, never from the simulator directly.
 * To use real data, write another object that satisfies `MarketData` (for example
 * one that polls a quotes API into an in-memory cache) and export it here instead.
 * See README → "Plugging in real market data".
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/market/assets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$simulator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/market/simulator.ts [app-client] (ecmascript)");
;
;
const simulatedMarket = {
    sourceLabel: "Simulated prices",
    listAssets: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ASSETS"],
    getAsset: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAsset"],
    priceAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$simulator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["priceAt"],
    quote: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$simulator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quoteAt"],
    history: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$simulator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["historyFor"],
    stats: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$simulator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["statsFor"]
};
const market = simulatedMarket;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/market/simulator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DAY",
    ()=>DAY,
    "HOUR",
    ()=>HOUR,
    "MINUTE",
    ()=>MINUTE,
    "RANGES",
    ()=>RANGES,
    "RANGE_CONFIG",
    ()=>RANGE_CONFIG,
    "REF_TIME",
    ()=>REF_TIME,
    "YEAR",
    ()=>YEAR,
    "historyFor",
    ()=>historyFor,
    "priceAt",
    ()=>priceAt,
    "quoteAt",
    ()=>quoteAt,
    "roundPrice",
    ()=>roundPrice,
    "sampleTimes",
    ()=>sampleTimes,
    "statsFor",
    ()=>statsFor
]);
/**
 * Deterministic market simulator.
 *
 * The price of every asset is a pure function of (symbol, timestamp). That means:
 *  - everyone at the hackathon sees the same prices at the same moment,
 *  - you can ask for the price at ANY point in the past (charts, portfolio history,
 *    backtests) without storing anything,
 *  - prices keep "ticking" live just because time moves on.
 *
 * How: log(price) = log(refPrice) + drift * years + volatility * F(t), where F is
 * layered smooth noise (big slow waves for long-term trends, tiny fast wiggles for
 * live ticks). No real market data is used anywhere.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/market/assets.ts [app-client] (ecmascript)");
;
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const YEAR = 365 * DAY;
const REF_TIME = Date.UTC(2026, 0, 1);
/** Noise octaves: [period in ms, relative amplitude]. */ const OCTAVES = [
    [
        365 * DAY,
        0.6
    ],
    [
        90 * DAY,
        0.35
    ],
    [
        21 * DAY,
        0.2
    ],
    [
        5 * DAY,
        0.1
    ],
    [
        1 * DAY,
        0.05
    ],
    [
        4 * HOUR,
        0.025
    ],
    [
        1 * HOUR,
        0.012
    ],
    [
        15 * MINUTE,
        0.006
    ],
    [
        2 * MINUTE,
        0.003
    ],
    [
        15_000,
        0.0015
    ]
];
// ---------------------------------------------------------------------------
// Noise primitives
// ---------------------------------------------------------------------------
function hashString(s) {
    let h = 2166136261;
    for(let i = 0; i < s.length; i++){
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
/** Hash two integers into a float in [-1, 1]. */ function lattice(seed, i) {
    let h = seed ^ Math.imul(i | 0, 0x9e3779b1);
    h = Math.imul(h ^ h >>> 16, 0x85ebca6b);
    h = Math.imul(h ^ h >>> 13, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 0xffffffff * 2 - 1;
}
/** Smooth 1D value noise in roughly [-1, 1]. */ function valueNoise(seed, x) {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f); // smoothstep
    return lattice(seed, i) * (1 - u) + lattice(seed, i + 1) * u;
}
const seedCache = new Map();
function seedsFor(symbol) {
    let seeds = seedCache.get(symbol);
    if (!seeds) {
        const base = hashString(symbol);
        seeds = OCTAVES.map((_, k)=>base + Math.imul(k + 1, 0x27d4eb2d) >>> 0);
        seedCache.set(symbol, seeds);
    }
    return seeds;
}
function fractal(symbol, t) {
    const seeds = seedsFor(symbol);
    let sum = 0;
    for(let k = 0; k < OCTAVES.length; k++){
        const [period, amp] = OCTAVES[k];
        // Offset each octave so lattice points don't line up across octaves.
        sum += amp * valueNoise(seeds[k], t / period + k * 0.37);
    }
    return sum;
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
function requireAsset(symbol) {
    const asset = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$assets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ASSETS_BY_SYMBOL"][symbol];
    if (!asset) throw new Error(`Unknown symbol: ${symbol}`);
    return asset;
}
function priceAt(symbol, t) {
    const a = requireAsset(symbol);
    const years = (t - REF_TIME) / YEAR;
    const logP = Math.log(a.refPrice) + a.drift * years + a.volatility * (fractal(symbol, t) - fractal(symbol, REF_TIME));
    return roundPrice(Math.exp(logP));
}
function roundPrice(p) {
    const decimals = p >= 1 ? 2 : 4;
    const f = 10 ** decimals;
    return Math.round(p * f) / f;
}
function quoteAt(symbol, t) {
    const price = priceAt(symbol, t);
    const previousClose = priceAt(symbol, t - DAY);
    const change = price - previousClose;
    return {
        symbol,
        price,
        previousClose,
        change,
        changePct: previousClose ? change / previousClose : 0,
        time: t
    };
}
const RANGES = [
    "1D",
    "1W",
    "1M",
    "1Y",
    "5Y"
];
const RANGE_CONFIG = {
    "1D": {
        span: DAY,
        step: 5 * MINUTE
    },
    "1W": {
        span: 7 * DAY,
        step: 30 * MINUTE
    },
    "1M": {
        span: 30 * DAY,
        step: 4 * HOUR
    },
    "1Y": {
        span: YEAR,
        step: DAY
    },
    "5Y": {
        span: 5 * YEAR,
        step: 7 * DAY
    }
};
function sampleTimes(range, now) {
    const { span, step } = RANGE_CONFIG[range];
    const n = Math.round(span / step);
    const times = [];
    for(let i = n; i > 0; i--)times.push(now - i * step);
    times.push(now);
    return times;
}
function historyFor(symbol, range, now) {
    return sampleTimes(range, now).map((t)=>({
            t,
            price: priceAt(symbol, t)
        }));
}
function statsFor(symbol, now) {
    const day = historyFor(symbol, "1D", now).map((p)=>p.price);
    const year = historyFor(symbol, "1Y", now).map((p)=>p.price);
    return {
        dayHigh: Math.max(...day),
        dayLow: Math.min(...day),
        yearHigh: Math.max(...year),
        yearLow: Math.min(...year),
        yearChangePct: (year[year.length - 1] - year[0]) / year[0]
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/trading/engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pure trading logic: no React, no storage, no clock. Every function takes the
 * current state and returns a new one, which makes it easy to test (see
 * engine.test.ts) and to move to a server later.
 */ __turbopack_context__.s([
    "MIN_ORDER_EUR",
    ()=>MIN_ORDER_EUR,
    "ORDER_FEE",
    ()=>ORDER_FEE,
    "QTY_DECIMALS",
    ()=>QTY_DECIMALS,
    "availableCash",
    ()=>availableCash,
    "availableQuantity",
    ()=>availableQuantity,
    "deposit",
    ()=>deposit,
    "emptyAccount",
    ()=>emptyAccount,
    "executeOrder",
    ()=>executeOrder,
    "makeId",
    ()=>makeId,
    "netDeposits",
    ()=>netDeposits,
    "previewOrder",
    ()=>previewOrder,
    "roundCash",
    ()=>roundCash,
    "roundQty",
    ()=>roundQty,
    "summarize",
    ()=>summarize,
    "toggleWatch",
    ()=>toggleWatch,
    "valueHistory",
    ()=>valueHistory,
    "withdraw",
    ()=>withdraw
]);
const ORDER_FEE = 1; // flat EUR fee per trade
const MIN_ORDER_EUR = 1;
const QTY_DECIMALS = 6;
const EPS = 1e-9;
function roundQty(q) {
    const f = 10 ** QTY_DECIMALS;
    return Math.floor(q * f + EPS) / f;
}
function roundCash(x) {
    return Math.round(x * 100) / 100;
}
function emptyAccount() {
    return {
        cash: 0,
        positions: {},
        transactions: [],
        watchlist: [],
        orders: [],
        ordersCheckedAt: 0
    };
}
let counter = 0;
function makeId(time) {
    counter = (counter + 1) % 1_000_000;
    return `${time.toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
function availableCash(state) {
    const committed = (state.orders ?? []).filter((o)=>o.status === "open" && o.side === "buy").reduce((s, o)=>s + o.quantity * o.triggerPrice + ORDER_FEE, 0);
    return Math.max(0, roundCash(state.cash - committed));
}
function availableQuantity(state, symbol) {
    const held = state.positions[symbol]?.quantity ?? 0;
    const promised = (state.orders ?? []).filter((o)=>o.status === "open" && o.side === "sell" && o.symbol === symbol).reduce((s, o)=>s + o.quantity, 0);
    return Math.max(0, roundQty(held - promised));
}
function previewOrder(state, req, price) {
    if (!(price > 0)) return {
        ok: false,
        error: "No price available"
    };
    if (!(req.value > 0)) return {
        ok: false,
        error: "Enter an amount"
    };
    const quantity = roundQty(req.mode === "amount" ? req.value / price : req.value);
    if (quantity <= 0) return {
        ok: false,
        error: "Amount too small"
    };
    const gross = roundCash(quantity * price);
    if (gross < MIN_ORDER_EUR) return {
        ok: false,
        error: `Minimum order is €${MIN_ORDER_EUR}`
    };
    const fee = ORDER_FEE;
    if (req.side === "buy") {
        const net = roundCash(gross + fee);
        if (net > state.cash + EPS) return {
            ok: false,
            error: "Not enough cash"
        };
        if (net > availableCash(state) + EPS) return {
            ok: false,
            error: "Cash is reserved for open orders"
        };
        return {
            ok: true,
            value: {
                symbol: req.symbol,
                side: "buy",
                quantity,
                price,
                gross,
                fee,
                net
            }
        };
    }
    const held = state.positions[req.symbol]?.quantity ?? 0;
    if (quantity > held + EPS) return {
        ok: false,
        error: "You don't own that many"
    };
    if (quantity > availableQuantity(state, req.symbol) + EPS) {
        return {
            ok: false,
            error: "Some units are reserved for open sell orders"
        };
    }
    const net = roundCash(gross - fee);
    if (net <= 0) return {
        ok: false,
        error: "Amount doesn't cover the fee"
    };
    return {
        ok: true,
        value: {
            symbol: req.symbol,
            side: "sell",
            quantity,
            price,
            gross,
            fee,
            net
        }
    };
}
function executeOrder(state, req, price, time) {
    const preview = previewOrder(state, req, price);
    if (!preview.ok) return preview;
    const p = preview.value;
    const existing = state.positions[p.symbol];
    const positions = {
        ...state.positions
    };
    let realizedPnl;
    if (p.side === "buy") {
        const prevQty = existing?.quantity ?? 0;
        const prevCost = (existing?.avgCost ?? 0) * prevQty;
        const quantity = roundQty(prevQty + p.quantity);
        positions[p.symbol] = {
            symbol: p.symbol,
            quantity,
            avgCost: (prevCost + p.net) / quantity
        };
    } else {
        const avgCost = existing.avgCost;
        realizedPnl = roundCash(p.net - avgCost * p.quantity);
        const quantity = roundQty(existing.quantity - p.quantity);
        if (quantity <= EPS) delete positions[p.symbol];
        else positions[p.symbol] = {
            ...existing,
            quantity
        };
    }
    const tx = {
        id: makeId(time),
        type: p.side,
        time,
        amount: p.gross,
        fee: p.fee,
        symbol: p.symbol,
        quantity: p.quantity,
        price: p.price,
        realizedPnl
    };
    return {
        ok: true,
        value: {
            tx,
            state: {
                ...state,
                cash: roundCash(state.cash + (p.side === "buy" ? -p.net : p.net)),
                positions,
                transactions: [
                    ...state.transactions,
                    tx
                ]
            }
        }
    };
}
function deposit(state, amount, time) {
    if (!(amount > 0)) return {
        ok: false,
        error: "Enter an amount"
    };
    const tx = {
        id: makeId(time),
        type: "deposit",
        time,
        amount: roundCash(amount),
        fee: 0
    };
    return {
        ok: true,
        value: {
            ...state,
            cash: roundCash(state.cash + amount),
            transactions: [
                ...state.transactions,
                tx
            ]
        }
    };
}
function withdraw(state, amount, time) {
    if (!(amount > 0)) return {
        ok: false,
        error: "Enter an amount"
    };
    if (amount > state.cash + EPS) return {
        ok: false,
        error: "Not enough cash"
    };
    const tx = {
        id: makeId(time),
        type: "withdrawal",
        time,
        amount: roundCash(amount),
        fee: 0
    };
    return {
        ok: true,
        value: {
            ...state,
            cash: roundCash(state.cash - amount),
            transactions: [
                ...state.transactions,
                tx
            ]
        }
    };
}
function toggleWatch(state, symbol) {
    const has = state.watchlist.includes(symbol);
    return {
        ...state,
        watchlist: has ? state.watchlist.filter((s)=>s !== symbol) : [
            ...state.watchlist,
            symbol
        ]
    };
}
function summarize(state, price, t) {
    const holdings = Object.values(state.positions).map((pos)=>{
        const p = price(pos.symbol, t);
        const value = pos.quantity * p;
        const costBasis = pos.quantity * pos.avgCost;
        const pnl = value - costBasis;
        return {
            ...pos,
            price: p,
            value,
            costBasis,
            pnl,
            pnlPct: costBasis ? pnl / costBasis : 0
        };
    }).sort((a, b)=>b.value - a.value);
    const invested = holdings.reduce((s, h)=>s + h.value, 0);
    const costBasis = holdings.reduce((s, h)=>s + h.costBasis, 0);
    const pnl = invested - costBasis;
    return {
        cash: state.cash,
        invested,
        total: state.cash + invested,
        costBasis,
        pnl,
        pnlPct: costBasis ? pnl / costBasis : 0,
        holdings
    };
}
function valueHistory(transactions, times, price) {
    const txs = [
        ...transactions
    ].sort((a, b)=>a.time - b.time);
    let cash = 0;
    const qty = {};
    let i = 0;
    return times.map((t)=>{
        while(i < txs.length && txs[i].time <= t){
            const tx = txs[i++];
            if (tx.type === "deposit") cash += tx.amount;
            else if (tx.type === "withdrawal") cash -= tx.amount;
            else if (tx.type === "buy") {
                cash -= tx.amount + tx.fee;
                qty[tx.symbol] = (qty[tx.symbol] ?? 0) + tx.quantity;
            } else if (tx.type === "sell") {
                cash += tx.amount - tx.fee;
                qty[tx.symbol] = (qty[tx.symbol] ?? 0) - tx.quantity;
            }
        }
        let value = cash;
        for(const s in qty)if (qty[s] > EPS) value += qty[s] * price(s, t);
        return {
            t,
            value
        };
    });
}
function netDeposits(transactions, t = Infinity) {
    return transactions.reduce((s, tx)=>{
        if (tx.time > t) return s;
        if (tx.type === "deposit") return s + tx.amount;
        if (tx.type === "withdrawal") return s - tx.amount;
        return s;
    }, 0);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/trading/seed.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STARTING_CASH",
    ()=>STARTING_CASH,
    "createDemoAccount",
    ()=>createDemoAccount,
    "createFreshAccount",
    ()=>createFreshAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$simulator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/market/simulator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/trading/engine.ts [app-client] (ecmascript)");
;
;
const STARTING_CASH = 10_000;
function createFreshAccount(now) {
    const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deposit"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyAccount"])(), STARTING_CASH, now);
    if (!r.ok) throw new Error(r.error);
    return {
        ...r.value,
        watchlist: [
            "VWCE",
            "AAPL",
            "BTC"
        ]
    };
}
const DEMO_STEPS = [
    {
        daysAgo: 210,
        deposit: STARTING_CASH
    },
    {
        daysAgo: 209,
        order: {
            symbol: "VWCE",
            side: "buy",
            mode: "amount",
            value: 2500
        }
    },
    {
        daysAgo: 180,
        order: {
            symbol: "AAPL",
            side: "buy",
            mode: "amount",
            value: 800
        }
    },
    {
        daysAgo: 150,
        order: {
            symbol: "NVDA",
            side: "buy",
            mode: "amount",
            value: 900
        }
    },
    {
        daysAgo: 120,
        order: {
            symbol: "ASML",
            side: "buy",
            mode: "amount",
            value: 700
        }
    },
    {
        daysAgo: 90,
        order: {
            symbol: "BTC",
            side: "buy",
            mode: "amount",
            value: 500
        }
    },
    {
        daysAgo: 60,
        order: {
            symbol: "MSFT",
            side: "buy",
            mode: "amount",
            value: 600
        }
    },
    {
        daysAgo: 45,
        order: {
            symbol: "VWCE",
            side: "buy",
            mode: "amount",
            value: 500
        }
    },
    {
        daysAgo: 30,
        order: {
            symbol: "NVDA",
            side: "sell",
            mode: "amount",
            value: 300
        }
    },
    {
        daysAgo: 20,
        deposit: 500
    },
    {
        daysAgo: 7,
        order: {
            symbol: "KBC",
            side: "buy",
            mode: "amount",
            value: 400
        }
    }
];
function createDemoAccount(now, price) {
    let state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyAccount"])();
    for (const step of DEMO_STEPS){
        // Snap to a round minute so the log looks tidy.
        const t = Math.floor((now - step.daysAgo * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$simulator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY"]) / 60_000) * 60_000;
        if ("deposit" in step) {
            const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deposit"])(state, step.deposit, t);
            if (r.ok) state = r.value;
        } else {
            const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["executeOrder"])(state, step.order, price(step.order.symbol, t), t);
            if (r.ok) state = r.value.state;
        }
    }
    return {
        ...state,
        watchlist: [
            "TSLA",
            "SAP",
            "ETH",
            "CSPX"
        ]
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/trading/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STORAGE_KEY",
    ()=>STORAGE_KEY,
    "useAccount",
    ()=>useAccount,
    "useAccountStore",
    ()=>useAccountStore
]);
/**
 * Client-side account store (zustand, persisted to localStorage).
 *
 * The store is a thin wrapper: all rules live in `engine.ts`. If your hackathon
 * team wants a real backend, replace these actions with fetch calls to API routes
 * that run the same engine functions server-side.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$1$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.1.0_@types+react@19.3.0_react@19.3.0/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$1$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.1.0_@types+react@19.3.0_react@19.3.0/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/market/provider.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/trading/engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/trading/seed.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY = "papertrade-account-v1";
const useAccountStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$1$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$1$2e$0_$40$types$2b$react$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        account: null,
        placeOrder (req) {
            const account = get().account;
            if (!account) return {
                ok: false,
                error: "Account not loaded"
            };
            const now = Date.now();
            const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["executeOrder"])(account, req, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["market"].priceAt(req.symbol, now), now);
            if (!r.ok) return r;
            set({
                account: r.value.state
            });
            return {
                ok: true,
                value: r.value.tx
            };
        },
        deposit (amount) {
            const account = get().account;
            if (!account) return {
                ok: false,
                error: "Account not loaded"
            };
            const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deposit"])(account, amount, Date.now());
            if (!r.ok) return r;
            set({
                account: r.value
            });
            return {
                ok: true,
                value: null
            };
        },
        withdraw (amount) {
            const account = get().account;
            if (!account) return {
                ok: false,
                error: "Account not loaded"
            };
            const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withdraw"])(account, amount, Date.now());
            if (!r.ok) return r;
            set({
                account: r.value
            });
            return {
                ok: true,
                value: null
            };
        },
        toggleWatch (symbol) {
            const account = get().account;
            if (account) set({
                account: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleWatch"])(account, symbol)
            });
        },
        reset (kind) {
            const now = Date.now();
            set({
                account: kind === "demo" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDemoAccount"])(now, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$market$2f$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["market"].priceAt) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$seed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFreshAccount"])(now)
            });
        }
    }), {
    name: STORAGE_KEY,
    partialize: (s)=>({
            account: s.account
        }),
    // Hydrated manually in <AppProviders> to avoid SSR/client mismatches.
    skipHydration: true
}));
const EMPTY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$trading$2f$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emptyAccount"])();
function useAccount() {
    _s();
    return useAccountStore({
        "useAccount.useAccountStore": (s)=>s.account
    }["useAccount.useAccountStore"]) ?? EMPTY;
}
_s(useAccount, "PssPAvFpRBjUv1f7N/Gd7c+9kig=", false, function() {
    return [
        useAccountStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0krp7ynto36pl._.js.map