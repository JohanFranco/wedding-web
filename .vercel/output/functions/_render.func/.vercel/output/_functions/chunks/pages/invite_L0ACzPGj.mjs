/* empty css                             */
import { c as createComponent, r as renderTemplate, g as addAttribute, i as renderHead, j as renderSlot, h as createAstro, k as renderComponent, m as maybeRenderHead } from '../astro_qe6eTkyt.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                           */

const $$Astro = createAstro();
const $$LayoutInvite = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LayoutInvite;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-refakslm> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body data-astro-cid-refakslm> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/omar/Desktop/JOJODEV/wedding-website/src/layouts/LayoutInvite.astro", void 0);

const invite = new Proxy({"src":"/_astro/invite.oAeNAgba.png","width":1428,"height":2000,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/omar/Desktop/JOJODEV/wedding-website/src/assets/images/invite.png";
							}
							
							return target[name];
						}
					});

const $$Invite = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LayoutInvite", $$LayoutInvite, { "title": "Invitaci\xF3n", "data-astro-cid-x5bjbgrh": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="invite flex justify-center p-5" id="invite" data-astro-cid-x5bjbgrh> <div class="error max-w-screen-md bg-red-900" id="error" data-astro-cid-x5bjbgrh> <span class="text-xl text-white p-12" data-astro-cid-x5bjbgrh>Parece que no has sido invitado. tal vez deberías tener más amigos.</span> </div> <div class="invited w-80 bg-white drop-shadow-lg" id="invited" data-astro-cid-x5bjbgrh> <div class="relative bg-white h-full text-center" data-astro-cid-x5bjbgrh> <img${addAttribute(invite.src, "src")} alt="Invitación" data-astro-cid-x5bjbgrh> <div class="head text-ambeer-950 text-center" data-astro-cid-x5bjbgrh> <p class="gupter" data-astro-cid-x5bjbgrh><span id="name" data-astro-cid-x5bjbgrh></span>,<br data-astro-cid-x5bjbgrh> has sido invitado <br data-astro-cid-x5bjbgrh> a nuestra boda.</p> </div> <div class="qr text-ambeer-950" data-astro-cid-x5bjbgrh> <p class="gupter" data-astro-cid-x5bjbgrh>Válido para <span id="tickets" data-astro-cid-x5bjbgrh></span> entradas</p> <div class="flex justify-center w-full bg-transparent" data-astro-cid-x5bjbgrh> <canvas id="canvas" class="bg-transparent w-18 h-18" data-astro-cid-x5bjbgrh></canvas> </div> </div> </div> </div> </div> <div id="btn" class="div-button flex justify-center" data-astro-cid-x5bjbgrh> <button class="text-amber-950 text-center hover:scale-105 transition-all cursor-pointer w-80 border-2 border-amber-950 p-3" onclick="exportToPng()" data-astro-cid-x5bjbgrh>Descargar</button> </div> ` })}  `;
}, "/Users/omar/Desktop/JOJODEV/wedding-website/src/pages/invite.astro", void 0);

const $$file = "/Users/omar/Desktop/JOJODEV/wedding-website/src/pages/invite.astro";
const $$url = "/invite";

export { $$Invite as default, $$file as file, $$url as url };
