import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import 'html-escaper';
import 'clsx';
import './chunks/astro_qe6eTkyt.mjs';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

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
function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    const path = toPath(sanitizedParams);
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
    isIndex: rawRouteData.isIndex
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
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/confirm","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/confirm\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"confirm","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/confirm.ts","pathname":"/api/confirm","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/message","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/message\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"message","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/message.ts","pathname":"/api/message","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/register","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/register\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/register.ts","pathname":"/api/register","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/[id].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/checkUrl.c_zJbiRJ.css"}],"routeData":{"route":"/checkurl","isIndex":false,"type":"page","pattern":"^\\/checkUrl\\/?$","segments":[[{"content":"checkUrl","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/checkUrl.astro","pathname":"/checkUrl","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BSW94MpP.js"}],"styles":[{"type":"external","src":"/_astro/checkUrl.c_zJbiRJ.css"},{"type":"inline","content":"@keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@keyframes notyf-fadeinleft{0%{opacity:0;transform:translate(25%)}to{opacity:1;transform:translate(0)}}@keyframes notyf-fadeoutright{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(25%)}}@keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@keyframes ripple{0%{transform:scale(0) translateY(-45%) translate(13%)}to{transform:scale(1) translateY(-45%) translate(13%)}}.notyf{position:fixed;top:0;left:0;height:100%;width:100%;color:#fff;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;pointer-events:none;box-sizing:border-box;padding:20px}.notyf__icon--error,.notyf__icon--success{height:21px;width:21px;background:#fff;border-radius:50%;display:block;margin:0 auto;position:relative}.notyf__icon--error:after,.notyf__icon--error:before{content:\"\";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px;left:9px;height:12px;top:5px}.notyf__icon--error:after{transform:rotate(-45deg)}.notyf__icon--error:before{transform:rotate(45deg)}.notyf__icon--success:after,.notyf__icon--success:before{content:\"\";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px}.notyf__icon--success:after{height:6px;transform:rotate(-45deg);top:9px;left:6px}.notyf__icon--success:before{height:11px;transform:rotate(45deg);top:5px;left:10px}.notyf__toast{display:block;overflow:hidden;pointer-events:auto;animation:notyf-fadeinup .3s ease-in forwards;box-shadow:0 3px 7px #00000040;position:relative;padding:0 15px;border-radius:2px;max-width:300px;transform:translateY(25%);box-sizing:border-box;flex-shrink:0}.notyf__toast--disappear{transform:translateY(0);animation:notyf-fadeoutdown .3s forwards;animation-delay:.25s}.notyf__toast--disappear .notyf__icon,.notyf__toast--disappear .notyf__message{animation:notyf-fadeoutdown .3s forwards;opacity:1;transform:translateY(0)}.notyf__toast--disappear .notyf__dismiss{animation:notyf-fadeoutright .3s forwards;opacity:1;transform:translate(0)}.notyf__toast--disappear .notyf__message{animation-delay:.05s}.notyf__toast--upper{margin-bottom:20px}.notyf__toast--lower{margin-top:20px}.notyf__toast--dismissible .notyf__wrapper{padding-right:30px}.notyf__ripple{height:400px;width:400px;position:absolute;transform-origin:bottom right;right:0;top:0;border-radius:50%;transform:scale(0) translateY(-51%) translate(13%);z-index:5;animation:ripple .4s ease-out forwards}.notyf__wrapper{display:flex;align-items:center;padding-top:17px;padding-bottom:17px;padding-right:15px;border-radius:3px;position:relative;z-index:10}.notyf__icon{width:22px;text-align:center;font-size:1.3em;opacity:0;animation:notyf-fadeinup .3s forwards;animation-delay:.3s;margin-right:13px}.notyf__dismiss{position:absolute;top:0;right:0;height:100%;width:26px;margin-right:-15px;animation:notyf-fadeinleft .3s forwards;animation-delay:.35s;opacity:0}.notyf__dismiss-btn{background-color:#00000040;border:none;cursor:pointer;transition:opacity .2s ease,background-color .2s ease;outline:none;opacity:.35;height:100%;width:100%}.notyf__dismiss-btn:after,.notyf__dismiss-btn:before{content:\"\";background:#fff;height:12px;width:2px;border-radius:3px;position:absolute;left:calc(50% - 1px);top:calc(50% - 5px)}.notyf__dismiss-btn:after{transform:rotate(-45deg)}.notyf__dismiss-btn:before{transform:rotate(45deg)}.notyf__dismiss-btn:hover{opacity:.7;background-color:#00000026}.notyf__dismiss-btn:active{opacity:.8}.notyf__message{vertical-align:middle;position:relative;opacity:0;animation:notyf-fadeinup .3s forwards;animation-delay:.25s;line-height:1.5em}@media only screen and (max-width:480px){.notyf{padding:0}.notyf__ripple{height:600px;width:600px;animation-duration:.5s}.notyf__toast{max-width:none;border-radius:0;box-shadow:0 -2px 7px #00000021;width:100%}.notyf__dismiss{width:56px}}\nbody{background-color:#fff}.error[data-astro-cid-x5bjbgrh],.invited[data-astro-cid-x5bjbgrh]{display:none}.gupter[data-astro-cid-x5bjbgrh]{font-family:Gupter,serif!important;text-transform:uppercase;font-weight:400;letter-spacing:3px}.qr[data-astro-cid-x5bjbgrh]{width:100%;height:100px;position:absolute;top:67%}.head[data-astro-cid-x5bjbgrh]{width:100%;height:100px;position:absolute;top:3%}.qr[data-astro-cid-x5bjbgrh] span[data-astro-cid-x5bjbgrh],p[data-astro-cid-x5bjbgrh]{font-size:10px}.qr[data-astro-cid-x5bjbgrh] div[data-astro-cid-x5bjbgrh] canvas[data-astro-cid-x5bjbgrh]{height:60px!important;width:60px!important;margin-top:2px!important}\n"}],"routeData":{"route":"/invite","isIndex":false,"type":"page","pattern":"^\\/invite\\/?$","segments":[[{"content":"invite","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/invite.astro","pathname":"/invite","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.B176hkHA.js"}],"styles":[{"type":"inline","content":"@keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@keyframes notyf-fadeinleft{0%{opacity:0;transform:translate(25%)}to{opacity:1;transform:translate(0)}}@keyframes notyf-fadeoutright{0%{opacity:1;transform:translate(0)}to{opacity:0;transform:translate(25%)}}@keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@keyframes ripple{0%{transform:scale(0) translateY(-45%) translate(13%)}to{transform:scale(1) translateY(-45%) translate(13%)}}.notyf{position:fixed;top:0;left:0;height:100%;width:100%;color:#fff;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;pointer-events:none;box-sizing:border-box;padding:20px}.notyf__icon--error,.notyf__icon--success{height:21px;width:21px;background:#fff;border-radius:50%;display:block;margin:0 auto;position:relative}.notyf__icon--error:after,.notyf__icon--error:before{content:\"\";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px;left:9px;height:12px;top:5px}.notyf__icon--error:after{transform:rotate(-45deg)}.notyf__icon--error:before{transform:rotate(45deg)}.notyf__icon--success:after,.notyf__icon--success:before{content:\"\";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px}.notyf__icon--success:after{height:6px;transform:rotate(-45deg);top:9px;left:6px}.notyf__icon--success:before{height:11px;transform:rotate(45deg);top:5px;left:10px}.notyf__toast{display:block;overflow:hidden;pointer-events:auto;animation:notyf-fadeinup .3s ease-in forwards;box-shadow:0 3px 7px #00000040;position:relative;padding:0 15px;border-radius:2px;max-width:300px;transform:translateY(25%);box-sizing:border-box;flex-shrink:0}.notyf__toast--disappear{transform:translateY(0);animation:notyf-fadeoutdown .3s forwards;animation-delay:.25s}.notyf__toast--disappear .notyf__icon,.notyf__toast--disappear .notyf__message{animation:notyf-fadeoutdown .3s forwards;opacity:1;transform:translateY(0)}.notyf__toast--disappear .notyf__dismiss{animation:notyf-fadeoutright .3s forwards;opacity:1;transform:translate(0)}.notyf__toast--disappear .notyf__message{animation-delay:.05s}.notyf__toast--upper{margin-bottom:20px}.notyf__toast--lower{margin-top:20px}.notyf__toast--dismissible .notyf__wrapper{padding-right:30px}.notyf__ripple{height:400px;width:400px;position:absolute;transform-origin:bottom right;right:0;top:0;border-radius:50%;transform:scale(0) translateY(-51%) translate(13%);z-index:5;animation:ripple .4s ease-out forwards}.notyf__wrapper{display:flex;align-items:center;padding-top:17px;padding-bottom:17px;padding-right:15px;border-radius:3px;position:relative;z-index:10}.notyf__icon{width:22px;text-align:center;font-size:1.3em;opacity:0;animation:notyf-fadeinup .3s forwards;animation-delay:.3s;margin-right:13px}.notyf__dismiss{position:absolute;top:0;right:0;height:100%;width:26px;margin-right:-15px;animation:notyf-fadeinleft .3s forwards;animation-delay:.35s;opacity:0}.notyf__dismiss-btn{background-color:#00000040;border:none;cursor:pointer;transition:opacity .2s ease,background-color .2s ease;outline:none;opacity:.35;height:100%;width:100%}.notyf__dismiss-btn:after,.notyf__dismiss-btn:before{content:\"\";background:#fff;height:12px;width:2px;border-radius:3px;position:absolute;left:calc(50% - 1px);top:calc(50% - 5px)}.notyf__dismiss-btn:after{transform:rotate(-45deg)}.notyf__dismiss-btn:before{transform:rotate(45deg)}.notyf__dismiss-btn:hover{opacity:.7;background-color:#00000026}.notyf__dismiss-btn:active{opacity:.8}.notyf__message{vertical-align:middle;position:relative;opacity:0;animation:notyf-fadeinup .3s forwards;animation-delay:.25s;line-height:1.5em}@media only screen and (max-width:480px){.notyf{padding:0}.notyf__ripple{height:600px;width:600px;animation-duration:.5s}.notyf__toast{max-width:none;border-radius:0;box-shadow:0 -2px 7px #00000021;width:100%}.notyf__dismiss{width:56px}}\n"},{"type":"external","src":"/_astro/checkUrl.c_zJbiRJ.css"},{"type":"inline","content":"@import\"https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Gupter:wght@400;500;700&display=swap\";body{background-color:#fbf9f3}html{scroll-behavior:smooth}[data-astro-cid-ihllb3az]{margin:0;padding:0;box-sizing:border-box}.gallery-wrap[data-astro-cid-ihllb3az]{width:1400px;margin:20px auto;-moz-columns:4;columns:4;-moz-column-gap:15px;column-gap:15px}.box[data-astro-cid-ihllb3az]{width:100%;margin-bottom:15px;-moz-column-break-inside:avoid;break-inside:avoid}img[data-astro-cid-ihllb3az]{max-width:100%}@media (max-width: 1200px){.gallery-wrap[data-astro-cid-ihllb3az]{width:calc(100% - 40px);-moz-columns:3;columns:3}}@media (max-width: 760px){.gallery-wrap[data-astro-cid-ihllb3az]{-moz-columns:2;columns:2}}@media (max-width: 480px){.gallery-wrap[data-astro-cid-ihllb3az]{-moz-columns:1;columns:1}}.cita[data-astro-cid-ihllb3az]{margin-bottom:6rem!important}h3[data-astro-cid-ihllb3az]{margin:20px;margin-top:6rem}h4[data-astro-cid-ihllb3az]{margin:20px}dialog[data-astro-cid-ihllb3az]{opacity:0;transition:opacity .3s ease-in-out}dialog[data-astro-cid-ihllb3az].show{opacity:1}dialog[data-astro-cid-ihllb3az].hide{opacity:0}input[data-astro-cid-xfnry2t2]{background-color:transparent!important}.gupter{font-family:Gupter,serif!important;text-transform:uppercase;letter-spacing:5px;font-weight:400}.sans{font-family:Fira Sans,sans-serif!important;letter-spacing:3px;text-transform:uppercase;font-weight:400}@keyframes scale-a-lil{0%{scale:.5}}@media (prefers-reduced-motion: no-preference){.component{animation:scale-a-lil linear both;animation-timeline:view();animation-range:20vh 60vh}}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/omar/Desktop/JOJODEV/wedding-website/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/omar/Desktop/JOJODEV/wedding-website/src/pages/invite.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/src/pages/checkUrl.astro":"chunks/pages/checkUrl_BYu90wag.mjs","/src/pages/api/confirm.ts":"chunks/pages/confirm_D7uqE9H1.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_0ay0VF7r.mjs","/src/pages/index.astro":"chunks/pages/index_5eyALLql.mjs","/src/pages/invite.astro":"chunks/pages/invite_L0ACzPGj.mjs","/src/pages/api/message.ts":"chunks/pages/message_DpOr5ai5.mjs","/src/pages/api/register.ts":"chunks/pages/register_DQpxAas5.mjs","\u0000@astrojs-manifest":"manifest_DJimRKqo.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_BouAAgy1.mjs","\u0000@astro-page:src/pages/api/confirm@_@ts":"chunks/confirm_CYoFGIAq.mjs","\u0000@astro-page:src/pages/api/message@_@ts":"chunks/message_Cz2jX1Co.mjs","\u0000@astro-page:src/pages/api/register@_@ts":"chunks/register_BGOrl-_A.mjs","\u0000@astro-page:src/pages/api/[id]@_@ts":"chunks/_id__DI-GeRGH.mjs","\u0000@astro-page:src/pages/checkUrl@_@astro":"chunks/checkUrl_CNVb5cEJ.mjs","\u0000@astro-page:src/pages/invite@_@astro":"chunks/invite_BrTJDswu.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_rhPNwcfC.mjs","/Users/omar/Desktop/JOJODEV/wedding-website/node_modules/astro/dist/env/setup.js":"chunks/setup_pmSpHZTB.mjs","/astro/hoisted.js?q=1":"_astro/hoisted.B176hkHA.js","/astro/hoisted.js?q=0":"_astro/hoisted.BSW94MpP.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/invite.oAeNAgba.png","/_astro/checkUrl.c_zJbiRJ.css","/favicon.svg","/_astro/hoisted.B176hkHA.js","/_astro/hoisted.BSW94MpP.js","/_astro/notyf.min.DDgbOC8d.js"],"buildFormat":"directory","checkOrigin":false,"rewritingEnabled":false,"experimentalEnvGetSecretEnabled":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
