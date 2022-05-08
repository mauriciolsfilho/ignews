import * as prismic from "@prismicio/client";

/**
 * Retorna instância de Prismic client
 * @returns
 */
export function getPrismicClient() {
  const client = prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  return client;
}
