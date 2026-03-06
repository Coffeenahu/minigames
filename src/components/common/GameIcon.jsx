import styles from './GameIcon.module.css';

export default function GameIcon({ gameId }) {
  switch (gameId) {
    case 'coin':
      return (
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '40px', color: '#FFD700' }}
        >
          monetization_on
        </span>
      );
    case 'dice':
      return (
        <div className={styles.dice}>
          <div className={styles.diceDot} /><div /><div className={styles.diceDot} />
          <div /><div className={styles.diceDot} /><div />
          <div className={styles.diceDot} /><div /><div className={styles.diceDot} />
        </div>
      );
    case 'pirate':
      return (
        <div className={styles.pirateFlag}>
          <div className={styles.pirateFlagPole} />
          <span className={styles.pirateFlagSkull}>💀</span>
        </div>
      );
    case 'ladder':
      return (
        <div className={styles.ladder}>
          <div className={styles.ladderRail} />
          <div className={styles.ladderRungs}>
            <div className={styles.ladderRung} />
            <div className={styles.ladderRung} />
            <div className={styles.ladderRung} />
            <div className={styles.ladderRung} />
          </div>
          <div className={styles.ladderRail} />
        </div>
      );
    default:
      return null;
  }
}
