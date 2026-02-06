import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BiqAoSAz.mjs';
import { manifest } from './manifest_uDA-81VD.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/memories.astro.mjs');
const _page2 = () => import('./pages/api/test.astro.mjs');
const _page3 = () => import('./pages/api/test-upload.astro.mjs');
const _page4 = () => import('./pages/api/upload.astro.mjs');
const _page5 = () => import('./pages/guestbook.astro.mjs');
const _page6 = () => import('./pages/upload.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/memories.js", _page1],
    ["src/pages/api/test.js", _page2],
    ["src/pages/api/test-upload.js", _page3],
    ["src/pages/api/upload.js", _page4],
    ["src/pages/guestbook.astro", _page5],
    ["src/pages/upload.astro", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "64e7dab1-4597-4143-a1aa-00ee3ef60cc2",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
