import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Link from "next/link";

type Post = {
  slug: string;
  excerpt: string;
  title: string;
  updatedAt: string;
};

interface PostProps {
  posts: Post[];
}
/**
 *
 * @returns
 */
export default function Posts({ posts }: PostProps) {
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
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

/**
 * Retorna os dados do CMS
 * @returns
 */
export const getStaticProps: GetStaticProps = async () => {
  const clientPrismic = getPrismicClient();

  const response = await clientPrismic.getByType("post", {
    fetch: ["post.title", "post.content"],
    pageSize: 100,
  });

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
