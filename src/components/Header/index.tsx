import Link from 'next/link';

import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header() {
  return (
    <div className={commonStyles.container}>
      <div className={styles.content}>
        <Link href="/">
          <a className={styles.logo}>
            <img src="/Logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </div>
  );
}
