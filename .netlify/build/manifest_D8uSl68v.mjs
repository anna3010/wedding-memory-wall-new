import 'piccolore';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, h as decodeKey } from './chunks/astro/server_DJcqXaZB.mjs';
import 'es-module-lexer';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/","cacheDir":"file:///C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/node_modules/.astro/","outDir":"file:///C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/dist/","srcDir":"file:///C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/","publicDir":"file:///C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/public/","buildClientDir":"file:///C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/dist/","buildServerDir":"file:///C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"guestbook/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/guestbook","isIndex":false,"type":"page","pattern":"^\\/guestbook\\/?$","segments":[[{"content":"guestbook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/guestbook.astro","pathname":"/guestbook","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"upload/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/upload","isIndex":false,"type":"page","pattern":"^\\/upload\\/?$","segments":[[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/upload.astro","pathname":"/upload","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/guestbook.astro",{"propagation":"none","containsHead":true}],["C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/upload.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/guestbook@_@astro":"pages/guestbook.astro.mjs","\u0000@astro-page:src/pages/upload@_@astro":"pages/upload.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_D8uSl68v.mjs","C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/node_modules/unstorage/drivers/netlify-blobs.mjs":"chunks/netlify-blobs_DM36vZAS.mjs","C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/components/MemoryGallery.jsx":"_astro/MemoryGallery.DVIHzbnn.js","C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/components/UploadForm.jsx":"_astro/UploadForm.CQQoxGzq.js","@astrojs/react/client.js":"_astro/client.dXHaCmHv.js","C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.CP2sq77P.js","C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/guestbook.astro?astro&type=script&index=0&lang.ts":"_astro/guestbook.astro_astro_type_script_index_0_lang.Bshp7POG.js","C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/layouts/MainLayout.astro?astro&type=script&index=0&lang.ts":"_astro/MainLayout.astro_astro_type_script_index_0_lang.B4ZDZkri.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/index.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){const t=document.getElementById(\"playIcon\"),n=document.getElementById(\"pauseIcon\"),l=document.getElementById(\"musicToggle\"),m=document.getElementById(\"musicStop\"),i=document.getElementById(\"progressBar\"),c=document.getElementById(\"currentTime\"),r=document.getElementById(\"duration\"),g=document.getElementById(\"volumeControl\"),u=document.getElementById(\"volumeValue\"),d=document.getElementById(\"songTitle\");if(!l||!t||!n||!m||!i||!c||!r||!g||!u||!d)return;const e=new Audio(\"https://www.bensound.com/bensound-music/bensound-romantic.mp3\");e.loop=!0,e.volume=.5;const h=[\"A Thousand Years - Christina Perri\",\"Perfect - Ed Sheeran\",\"All of Me - John Legend\",\"Thinking Out Loud - Ed Sheeran\",\"Marry You - Bruno Mars\"];let a=0;function p(o){const f=Math.floor(o/60),E=Math.floor(o%60);return`${f}:${E.toString().padStart(2,\"0\")}`}function s(){if(e.duration&&i&&c&&r){const o=e.currentTime/e.duration*100;i.style.width=o+\"%\",c.textContent=p(e.currentTime),r.textContent=p(e.duration)}}l.addEventListener(\"click\",function(){e.paused?e.play().then(()=>{t&&n&&(t.classList.add(\"hidden\"),n.classList.remove(\"hidden\"))}).catch(o=>{console.log(\"Audio play failed:\",o),d&&(d.textContent=\"Click to enable music (browser restriction)\")}):(e.pause(),t&&n&&(t.classList.remove(\"hidden\"),n.classList.add(\"hidden\")))}),m.addEventListener(\"click\",function(){e.pause(),e.currentTime=0,t&&n&&(t.classList.remove(\"hidden\"),n.classList.add(\"hidden\")),s()}),g.addEventListener(\"input\",function(){const o=Number(this.value)/100;e.volume=o,u&&(u.textContent=this.value+\"%\")}),e.addEventListener(\"timeupdate\",s),e.addEventListener(\"loadedmetadata\",s),e.addEventListener(\"ended\",function(){a=(a+1)%h.length,d&&(d.textContent=h[a]),s()}),s(),e.play().then(()=>{t&&n&&(t.classList.add(\"hidden\"),n.classList.remove(\"hidden\"))}).catch(o=>{console.log(\"Autoplay blocked, user interaction required\")})});"],["C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/pages/guestbook.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){const n=document.getElementById(\"playIcon\"),s=document.getElementById(\"pauseIcon\"),h=document.getElementById(\"musicToggle\"),y=document.getElementById(\"musicStop\"),c=document.getElementById(\"progressBar\"),l=document.getElementById(\"currentTime\"),u=document.getElementById(\"duration\"),E=document.getElementById(\"volumeControl\"),m=document.getElementById(\"volumeValue\"),i=document.getElementById(\"songTitle\");if(!h||!n||!s||!y||!c||!l||!u||!E||!m||!i)return;const e=new Audio(\"https://www.bensound.com/bensound-music/bensound-romantic.mp3\");e.loop=!0,e.volume=.5;const b=[\"A Thousand Years - Christina Perri\",\"Perfect - Ed Sheeran\",\"All of Me - John Legend\",\"Thinking Out Loud - Ed Sheeran\",\"Marry You - Bruno Mars\"];let g=0;function L(t){const a=Math.floor(t/60),d=Math.floor(t%60);return`${a}:${d.toString().padStart(2,\"0\")}`}function r(){if(e.duration&&c&&l&&u){const t=e.currentTime/e.duration*100;c.style.width=t+\"%\",l.textContent=L(e.currentTime),u.textContent=L(e.duration)}}h.addEventListener(\"click\",function(){e.paused?e.play().then(()=>{n&&s&&(n.classList.add(\"hidden\"),s.classList.remove(\"hidden\"))}).catch(t=>{console.log(\"Audio play failed:\",t),i&&(i.textContent=\"Click to enable music (browser restriction)\")}):(e.pause(),n&&s&&(n.classList.remove(\"hidden\"),s.classList.add(\"hidden\")))}),y.addEventListener(\"click\",function(){e.pause(),e.currentTime=0,n&&s&&(n.classList.remove(\"hidden\"),s.classList.add(\"hidden\")),r()}),E.addEventListener(\"input\",function(){const t=Number(this.value)/100;e.volume=t,m&&(m.textContent=this.value+\"%\")}),e.addEventListener(\"timeupdate\",r),e.addEventListener(\"loadedmetadata\",r),e.addEventListener(\"ended\",function(){g=(g+1)%b.length,i&&(i.textContent=b[g]),r()}),r(),e.play().then(()=>{n&&s&&(n.classList.add(\"hidden\"),s.classList.remove(\"hidden\"))}).catch(t=>{console.log(\"Autoplay blocked, user interaction required\")});const I=document.getElementById(\"guestBookForm\");I&&I.addEventListener(\"submit\",function(t){t.preventDefault();const a=document.getElementById(\"guestName\"),d=document.getElementById(\"guestMessage\"),p=document.getElementById(\"guestMessages\");if(!a||!d||!p)return;const f=a.value?.trim()||\"\",B=d.value?.trim()||\"\";if(!f||!B)return;const v=document.createElement(\"div\");v.className=\"bg-white rounded-lg p-4 shadow-sm animate-slide-in\";const T=[\"bg-pink-200\",\"bg-purple-200\",\"bg-blue-200\",\"bg-green-200\",\"bg-yellow-200\"],x=T[Math.floor(Math.random()*T.length)],C=f.split(\" \").map(k=>k[0]).join(\"\").toUpperCase().slice(0,2);v.innerHTML=`\n          <div class=\"flex items-start gap-3\">\n            <div class=\"w-10 h-10 ${x} rounded-full flex items-center justify-center\">\n              <span class=\"text-sm font-medium text-gray-700\">${C}</span>\n            </div>\n            <div class=\"flex-1\">\n              <div class=\"flex items-center gap-2 mb-1\">\n                <span class=\"font-medium text-gray-900\">${f}</span>\n                <span class=\"text-xs text-gray-500\">Just now</span>\n              </div>\n              <p class=\"text-gray-700 text-sm\">${B}</p>\n            </div>\n          </div>\n        `,p.insertBefore(v,p.firstChild),a.value=\"\",d.value=\"\";const o=t.target.querySelector('button[type=\"submit\"]');if(!o)return;const M=o.innerHTML;o.innerHTML=\"Message Sent! ✨\",o.classList.add(\"bg-green-600\",\"hover:bg-green-700\"),o.classList.remove(\"bg-pink-600\",\"hover:bg-pink-700\"),setTimeout(()=>{o.innerHTML=M,o.classList.remove(\"bg-green-600\",\"hover:bg-green-700\"),o.classList.add(\"bg-pink-600\",\"hover:bg-pink-700\")},2e3)})});"],["C:/Users/hmm/OneDrive/Documents/wedding-memory-wall-new/src/layouts/MainLayout.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){const e=window.location.pathname,a=document.querySelectorAll(\"nav a\");a.forEach(t=>{t.classList.remove(\"nav-active\",\"nav-guestbook-active\")}),e===\"/\"?a[0]?.classList.add(\"nav-active\"):e===\"/guestbook\"?a[1]?.classList.add(\"nav-guestbook-active\"):e===\"/upload\"&&a[2]?.classList.add(\"nav-active\")});"]],"assets":["/_astro/guestbook.CwOjFN84.css","/favicon.ico","/favicon.svg","/me.png","/_redirects","/uploads/1770403846199-ltr82o.jpg","/uploads/1770403882112-qeh0do.wav","/uploads/1770404261847-0db25d-b65a510bb5b680feae9ac3deb6c01a98.jpg.jpg","/uploads/1770404465934-iz6q12-recording-1770404457679.webm.webm","/uploads/1770404465937-kcjzbl-photo-1770404463814.jpg.jpg","/uploads/1770404596782-5nbvu7-photo-1770404584787.jpg.jpg","/uploads/1770404596785-83hn14-recording-1770404595244.webm.webm","/uploads/1770405663014-o74j05-IMG_1220.jpeg.jpg","/uploads/1770406497560-6vnvjh-IMG_1220.jpeg.jpg","/uploads/1770406582761-u0ia39-IMG_1157.jpeg.jpg","/uploads/1770406582774-o4zoe7-IMG_1117.jpeg.jpg","/uploads/1770406646747-t0z86t-IMG_0390.jpeg.jpg","/uploads/1770406835051-isljyz-79209968596__E2F4A8EF-B612-4717-98C9-8243A9DCFCF4.MOV.mov","/_astro/client.dXHaCmHv.js","/_astro/index.DYrVU9rO.js","/_astro/MemoryGallery.DVIHzbnn.js","/_astro/supabase.DTzxzQgG.js","/_astro/UploadForm.CQQoxGzq.js","/guestbook/index.html","/upload/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"p/3AJscK0RM0dWlFSUDK4mLQ0ztUeiTInntdRAbh9+M=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_DM36vZAS.mjs');

export { manifest };
