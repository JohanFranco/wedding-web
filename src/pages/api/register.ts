import type { APIRoute } from "astro";
import { object, safeParse, string } from 'valibot'; 
import { db, Guests } from 'astro:db'
import { v4 as uuidv4 } from 'uuid'

const RegisterSchema = object({
    phone: string(),
    fullName: string(),
    tickets: string()
})

export const POST: APIRoute = async ( {params, request} ) => {

    const { success, output } = safeParse(RegisterSchema, await request.json())
        if(!success) return new Response("Bad Request", { status: 400 })

    const id = uuidv4();
    const { phone, fullName, tickets} = output
    const guest = { id, phone, fullName, tickets }
    
    await db.insert(Guests).values(guest);
    return new Response("Gueest inserted successfully", { status: 200 })

}

