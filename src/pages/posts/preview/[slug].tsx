import { GetServerSideProps, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import * as prismic from "@prismicio/client";
import { getPrismicClient } from "../../../services/prismic";
import { RichText } from "prismic-dom";
import Head from "next/head";
import { useEffect } from "react";

import styles from "../post.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

interface PostPreviewProps {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}
export default function PostPreview(props: PostPreviewProps) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (props) {
      document.getElementById("content-post").innerHTML = props.content;
    }
  }, []);

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${props.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{props.title} | ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{props.title}</h1>
          <time>{props.updatedAt}</time>

          <div
            id="content-post"
            className={`${styles.content} ${styles.previewContent}`}
          />
          <div className={styles.readMore}>
            Continuar lendo?
            <Link href="/">
              <a href="">Assinar agora 🙌</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 4)).replace(
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
    revalidate: 60 * 2, // 2 minutos
  };
};
