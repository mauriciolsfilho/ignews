import styles from "./styles.module.scss";
import { useSession, signIn } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

type StripeSessionPropos = {
  id: string;
  mode: string;
  currency: string;
  customer: string;
  expires_at: Date;
  amount_total: number;
  payment_status: string;
  amount_subtotal: number;
  allow_promotion_codes: boolean;
};
export function SubscribeButton({ priceId }: { priceId: string }) {
  const { data } = useSession();

  async function handleSubscribe() {
    if (!data) {
      signIn("github");
      return;
    }

    try {
      console.log(data);
      const { data: stripeSession } = await api.post<StripeSessionPropos>(
        "/pay/subscribe",
        {
          user: data.user,
          priceId,
        }
      );
      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId: stripeSession.id });
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <button
      onClick={handleSubscribe}
      type="button"
      className={styles.subscribeBtn}
    >
      Subscribe now
    </button>
  );
}
