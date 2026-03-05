import styles from './ResultOverlay.module.css';

export default function ResultOverlay({ visible, onClose, children }) {
  if (!visible) return null;
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {children}
        <button className={styles.closeBtn} onClick={onClose}>
          다시 하기
        </button>
      </div>
    </div>
  );
}
