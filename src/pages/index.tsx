import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import { currencyFormat } from "../utils/formatter";
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
    type: string;
  };
}
export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>ig.news | Home</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all publications
            <br />
            <span>
              for {currencyFormat(product.amount, "en-US", "USD")} month
            </span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KmoRBDBrbZVN1b6MJlYOTLj");

  const product = {
    priceId: price.id,
    type: price.type,
    amount: price.unit_amount / 100,
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 1,
  };
};
