import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FaRegCalendar, FaRegUser } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';
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
  const formatadedPosts = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
    };
  });

  const [posts, setPosts] = useState(formatadedPosts);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleLoadNewPosts() {
    if (nextPage) {
      const { next_page, results } = await fetch(nextPage).then(response =>
        response.json()
      );
      setNextPage(next_page);
      setPosts([...posts, ...results]);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.posts}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a>
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
          </Link>
        ))}
        {nextPage && (
          <button type="button" onClick={handleLoadNewPosts}>
            Carregar mais posts
          </button>
        )}
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
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = { next_page: postsResponse.next_page, results };

  return {
    props: { postsPagination },
  };
};
