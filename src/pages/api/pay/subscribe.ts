import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../services/stripe";
import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

type User = {
  email: string;
  name: string;
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};
/**
 * Checkout session no stripe
 * @api
 */
export default async function subscribe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: { user: User; priceId: string } = req.body;
  const user: User = data.user;
  const priceId = data.priceId;

  console.log(priceId);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
    return;
  }

  if (user) {
    const savedUser = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
    );

    let customerId = savedUser.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        // metadata
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), savedUser.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );
      customerId = stripeCustomer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    res.status(200).json(session);
  }
}
