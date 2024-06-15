import type { APIRoute } from "astro";
import { object, safeParse, string } from 'valibot'; 
import { db, Guests, eq } from 'astro:db'
import { v4 as uuidv4 } from 'uuid'


export const GET: APIRoute = async ( { params, request }) => {
    const id = params.id;
    const guest = await db.select().from(Guests).where(eq(Guests.id, id))
    
    if(guest.length == 1){
      return new Response(JSON.stringify(guest[0]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response("Id number not found", { status: 404 })
}
