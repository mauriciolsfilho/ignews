import styles from "./styles.module.scss";

export function SubscribeButton({ priceId }: { priceId: string }) {
  return (
    <button type="button" className={styles.subscribeBtn}>
      Subscribe now
    </button>
  );
}
