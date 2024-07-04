import styles from './Header.module.scss';
import Link from 'next/link';

const Header = () => {
    return (
        <div className={styles.header}>
            <Link href="/">
                <div className={styles.profile_picture}></div>
            </Link>
        </div>
    )
}

export default Header;