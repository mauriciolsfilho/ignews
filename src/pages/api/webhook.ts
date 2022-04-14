import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

const stripeEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (stripeEvents.has(event.type)) {
        try {
          switch (event.type) {
            case "customer.subscription.created":
              const subscription = event.data.object as Stripe.Subscription;

              await saveSubscription(
                subscription.id,
                subscription.customer.toString(),
                true
              );
              break;
            case "customer.subscription.updated":
              break;
            case "customer.subscription.deleted":
              const sub = event.data.object as Stripe.Subscription;

              await saveSubscription(sub.id, sub.customer.toString());
              break;
            case "checkout.session.completed":
              const checkoutSession = event.data
                .object as Stripe.Checkout.Session;
              await saveSubscription(
                checkoutSession.subscription.toString(),
                checkoutSession.customer.toString(),
                true
              );
              break;
            default:
              throw new Error("Unhandled event.");
          }
        } catch (e) {
          // Disparar email para administrador
          // avisando que existe um webhook não tratado
          return res.json({ error: "Webhook handler failed." });
        }
      }
      res.json({ received: true });
    } catch (e) {
      return res.status(400).send(`Webhook error: ${e.message}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
