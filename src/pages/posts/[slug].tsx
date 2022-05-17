import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import * as prismic from "@prismicio/client";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Head from "next/head";
import { useEffect } from "react";

import styles from "./post.module.scss";

interface PostProps {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}
export default function Post(props: PostProps) {
  const session = useSession();
  useEffect(() => {
    console.log(session);
    if (props) {
      document.getElementById("content-post").innerHTML = props.content;
    }
  }, []);

  return (
    <>
      <Head>
        <title>{props.title} | ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{props.title}</h1>
          <time>{props.updatedAt}</time>

          <div id="content-post" className={styles.content}></div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content).replace(
      " block-img",
      "block-img"
    ),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: post,
  };
};
