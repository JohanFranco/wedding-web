import { createRemoteDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';

const db = await createRemoteDatabaseClient(process.env.ASTRO_STUDIO_APP_TOKEN, {"BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true, "SITE": undefined, "ASSETS_PREFIX": undefined}.ASTRO_STUDIO_REMOTE_DB_URL ?? "https://db.services.astro.build");
const Guests = asDrizzleTable("Guests", { "columns": { "id": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Guests", "primaryKey": true } }, "phone": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "phone", "collection": "Guests", "primaryKey": false, "optional": false } }, "fullName": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "fullName", "collection": "Guests", "primaryKey": false, "optional": false } }, "tickets": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "tickets", "collection": "Guests", "primaryKey": false, "optional": false } }, "isScanned": { "type": "boolean", "schema": { "optional": false, "unique": false, "deprecated": false, "name": "isScanned", "collection": "Guests" } } }, "deprecated": false, "indexes": {} }, false);

const GET = async ({ params, request }) => {
  const id = params.id;
  const guest = await db.select().from(Guests).where(eq(Guests.id, id));
  if (guest.length == 1) {
    return new Response(JSON.stringify(guest[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  return new Response("Id number not found", { status: 404 });
};

const _id_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET
}, Symbol.toStringTag, { value: 'Module' }));

export { Guests as G, _id_ as _, db as d };
