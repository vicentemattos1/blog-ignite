import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaRegCalendar, FaRegUser } from 'react-icons/fa';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  function handleLoadPosts() {}

  return (
    <main className={styles.container}>
      <div className={styles.posts}>
        {postsPagination.results.map(post => (
          <a key={post.uid} href={`/post/${post.uid}`}>
            <strong>{post.data.title}</strong>
            <span>{post.data.subtitle}</span>
            <div>
              <time>
                <FaRegCalendar size={14} />
                {post.first_publication_date}
              </time>
              <p>
                <FaRegUser size={14} />
                {post.data.author}
              </p>
            </div>
          </a>
        ))}
        <button
          type="button"
          onClick={() => {
            handleLoadPosts();
          }}
        >
          Carregar mais posts
        </button>
      </div>
    </main>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        parseISO(post.last_publication_date),
        'd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = { next_page: 1, results };

  return {
    props: { postsPagination },
  };
};
