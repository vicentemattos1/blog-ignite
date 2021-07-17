import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post?.data.title} | Blog</title>
      </Head>

      <main style={{ backgroundImage: `url("${post?.data.banner.url}")` }}>
        <article className={styles.container}>
          <h1>{post?.data.title}</h1>
          <time>{post?.first_publication_date}</time>
          {post?.data.content.map(subContent => (
            <div key={subContent.heading}>
              <h2>{subContent.heading}</h2>
              {subContent.body.map(description => (
                <span>{description.text}</span>
              ))}
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  // TODO
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});
  // console.log(JSON.stringify(response, null, 2));
  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  console.log(JSON.stringify(post, null, 2));
  return {
    props: { post },
  };

  // TODO
};
