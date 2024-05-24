import type { APIRoute } from "astro";
import { object, safeParse, string } from 'valibot'; 
import { db, Guests } from 'astro:db'

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const guests = await db.select().from(Guests);
        return new Response(JSON.stringify(guests), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error fetching guests:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch guests' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
}

export const POST: APIRoute = async ({ params, request}) => {
    //VALIDATE THAT THE PHONE WAS REGISTER IN GUEEST TABLE 

    //IF NOT REGISTEERD RETURN NOT FOUND

    //REGISTERRES RETURN STRING QR
}