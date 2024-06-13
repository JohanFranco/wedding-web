import { object, string, array, safeParse } from 'valibot';
import { d as db, G as Guests } from './_id__BvXywUlO.mjs';
import { v4 } from 'uuid';

const GuestSchema = object({
  phone: string(),
  fullName: string(),
  tickets: string()
});
const RegisterSchema = array(GuestSchema);
const POST = async ({ params, request }) => {
  const { success, output } = safeParse(RegisterSchema, await request.json());
  if (!success) return new Response("Bad Schema", { status: 400 });
  await db.delete(Guests).execute();
  const guests = output.map((guest) => ({
    id: v4(),
    phone: guest.phone,
    fullName: guest.fullName,
    tickets: guest.tickets,
    isScanned: false
  }));
  await db.insert(Guests).values(guests);
  return new Response("Guests inserted successfully", { status: 200 });
};
const GET = async ({ params, request }) => {
  const guests = await db.select().from(Guests);
  return new Response(JSON.stringify(guests), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export { GET, POST };
