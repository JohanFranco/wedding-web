import { object, string, safeParse } from 'valibot';
import { d as db, G as Guests } from './_id__BvXywUlO.mjs';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';

const verifySchema = object({
  phone: string()
});
const GET = async ({ params, request }) => {
  try {
    const guests = await db.select().from(Guests);
    return new Response(JSON.stringify(guests), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error fetching guests:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch guests" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const POST = async ({ params, request }) => {
  const { success, output } = safeParse(verifySchema, await request.json());
  if (!success) return new Response("Bad Request", { status: 400 });
  const { phone } = output;
  const guest = await db.select().from(Guests).where(eq(Guests.phone, phone));
  if (guest.length == 1) {
    return new Response(JSON.stringify(guest[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  return new Response("Phone number not found", { status: 404 });
};

export { GET, POST };
