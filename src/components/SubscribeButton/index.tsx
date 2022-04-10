import styles from "./styles.module.scss";
import { useSession } from "next-auth/react";

export function SubscribeButton({ priceId }: { priceId: string }) {
  const { data } = useSession();
  return (
    <button
      disabled={!!data}
      onClick={() => alert("click")}
      type="button"
      className={styles.subscribeBtn}
    >
      Subscribe now
    </button>
  );
}
