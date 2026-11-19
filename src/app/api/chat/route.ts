import { generateText } from "ai";
import { answerFromKnowledge } from "@/lib/faq";
import { getFaqs } from "@/lib/queries";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    message?: string;
    locale?: string;
  } | null;
  const message = body?.message?.trim() ?? "";
  const locale = body?.locale ?? "en";
  if (!message || message.length > 2000) {
    return Response.json({ error: "Invalid message" }, { status: 400 });
  }

  const faqs = await getFaqs();

  if (process.env.AI_GATEWAY_API_KEY) {
    try {
      const result = await generateText({
        model: "openai/gpt-4.1-mini",
        system:
          "You are the client support desk for iSense Technologies, the security division of Ellis Trading House PLC in Addis Ababa. Answer briefly about CCTV, access control, fire and intrusion alarms, metal detection, Unif1ed HRM, office hours, and contact details. If you do not know, tell the visitor to call +251 11 111 4031 or continue on WhatsApp.",
        prompt: message,
      });
      return Response.json({ text: result.text });
    } catch {
      // Fall back to FAQ knowledge base.
    }
  }

  return Response.json({ text: answerFromKnowledge(message, locale, faqs) });
}
