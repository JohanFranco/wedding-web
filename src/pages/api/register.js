import type { APIRoute } from "astro";
import { array, object, safeParse, string } from 'valibot'; 
import { db, Guests } from 'astro:db'
import { v4 as uuidv4 } from 'uuid'

const GuestSchema = object({
    phone: string(),
    fullName: string(),
    tickets: string()
})

const RegisterSchema = array(GuestSchema);

export const POST: APIRoute = async ({ params, request }) => {
    const { success, output } = safeParse(RegisterSchema, await request.json());
    if (!success) return new Response("Bad Schema", { status: 400 });

    await db.delete(Guests).execute();

    const guests = output.map(guest => ({
        id: uuidv4(),
        phone: guest.phone,
        fullName: guest.fullName,
        tickets: guest.tickets,
        isScanned: false
    }));

    await db.insert(Guests).values(guests);

    return new Response("Guests inserted successfully", { status: 200 });
};


export const GET: APIRoute = async ( { params, request }) => {
    const guests = await db.select().from(Guests)  
    return new Response(JSON.stringify(guests), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }); 
} 
