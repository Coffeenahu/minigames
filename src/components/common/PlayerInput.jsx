import { useState } from 'react';
import styles from './PlayerInput.module.css';

export default function PlayerInput({ players, onChange, maxPlayers }) {
  const [input, setInput] = useState('');

  const add = () => {
    const name = input.trim();
    if (!name || players.includes(name)) return;
    if (maxPlayers && players.length >= maxPlayers) return;
    onChange([...players, name]);
    setInput('');
  };

  const remove = (name) => onChange(players.filter((p) => p !== name));

  const handleKey = (e) => {
    if (e.key === 'Enter') add();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="참가자 이름 입력"
          maxLength={12}
        />
        <button
          className={styles.addBtn}
          onClick={add}
          disabled={!input.trim() || (maxPlayers && players.length >= maxPlayers)}
        >
          + 추가
        </button>
      </div>
      {maxPlayers && (
        <p className={styles.limit}>
          {players.length} / {maxPlayers}명
        </p>
      )}
      {players.length > 0 && (
        <ul className={styles.tags}>
          {players.map((p) => (
            <li key={p} className={styles.tag}>
              {p}
              <button onClick={() => remove(p)} aria-label={`${p} 제거`}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
