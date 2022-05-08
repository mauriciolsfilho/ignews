import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
/**
 *
 * @returns
 */
export default function Posts() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const dt = new Date();
    setDate(`${dt.getHours()}: ${dt.getMinutes()}: ${dt.getSeconds()}`);
  }, []);

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>{date}</time>
            <strong>Titulo do post de acordo com assunto</strong>
            <p>
              Lorem ipsum is placeholder text commonly used in the graphic,
              print, and publishing industries for previewing layouts and visual
              mockups
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
