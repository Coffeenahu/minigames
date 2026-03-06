import { GAMES } from '../games';
import GameCard from '../components/common/GameCard';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h2 className={styles.heroTitle}>나만 아니면 돼!</h2>
        <p className={styles.sub}>4가지 게임으로 운을 시험해보세요!</p>
      </section>

      <main className={styles.grid}>
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </main>

      <section className={styles.quickPlay}>
        <div className={styles.quickPlayCard}>
          <div className={styles.quickPlayIcon}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '24px' }}>
              rocket_launch
            </span>
          </div>
          <div className={styles.quickPlayInfo}>
            <p className={styles.quickPlayName}>랜덤 매치</p>
            <p className={styles.quickPlayDesc}>빠르게 게임 방에 참여하세요</p>
          </div>
          <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)', fontSize: '20px' }}>
            chevron_right
          </span>
        </div>
      </section>

      <div className={styles.navSpacer} />

      <nav className={styles.nav}>
        <a className={`${styles.navItem} ${styles.navActive}`} href="#">
          <span className={`material-symbols-outlined ${styles.navIcon}`}>videogame_asset</span>
          <span className={styles.navLabel}>게임</span>
        </a>
        <a className={styles.navItem} href="#">
          <span className={`material-symbols-outlined ${styles.navIcon}`}>history</span>
          <span className={styles.navLabel}>기록</span>
        </a>
        <a className={styles.navItem} href="#">
          <span className={`material-symbols-outlined ${styles.navIcon}`}>emoji_events</span>
          <span className={styles.navLabel}>랭킹</span>
        </a>
        <a className={styles.navItem} href="#">
          <span className={`material-symbols-outlined ${styles.navIcon}`}>settings</span>
          <span className={styles.navLabel}>설정</span>
        </a>
      </nav>
    </div>
  );
}
