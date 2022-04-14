import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../../services/stripe";

/**
 * gerencia as inscrições de acordo com os dados recebidos
 * @param subId
 * @param customerId
 * @param isCreate
 */
export async function saveSubscription(
  subId: string,
  customerId: string,
  isCreate: boolean = false
) {
  const userRef = await fauna.query(
    q.Select("ref", q.Get(q.Match(q.Index("user_by_stripe"), customerId)))
  );

  const subscription = await stripe.subscriptions.retrieve(subId);

  if (isCreate) {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), { data: subscription })
    );
  } else {
    await fauna.query(
      q.Replace(q.Select("ref", q.Get(q.Match(q.Index("sub_by_id"), subId))), {
        data: subscription,
      })
    );
  }
}
