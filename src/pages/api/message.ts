import type { APIRoute } from "astro";
import { object, safeParse, string } from 'valibot'; 

const verifySchema = object({
  phone: string(),
  url: string(),
  fullName: string(),
});

export const POST: APIRoute = async ({ request }) => {
  const { success, output } = safeParse(verifySchema, await request.json());
  if (!success) return new Response("Body content is not allowed", { status: 400 });

  const { phone, url, fullName } = output;
  const message = `Buen día ${fullName}, te saludan Magaly y Rene. En el siguiente link puedes consultar tu invitación para nuestra boda ${url}`;

  try {

    const twilio = await import('twilio'); 
    const client = twilio.default('AC7711786f3f35463979f87ea3c3db5fa6', '5ccf9ba2970fd9f2dc6291dfcc7a9272');

    await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', 
      to: `whatsapp:+521${phone}`
    });

    return new Response("Message has been sent", { status: 200 });
  } catch (err) {
    return new Response("Bad Request", { status: 400 });
  }
};
