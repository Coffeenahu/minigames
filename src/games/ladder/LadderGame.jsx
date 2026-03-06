import { useState, useRef, useEffect } from 'react';
import { generateLadder, tracePath, mapResults, shuffleArray } from './ladderUtils';
import styles from './LadderGame.module.css';

const STEPS = {
  PLAYERS: 'players',
  OUTCOMES: 'outcomes',
  GAME: 'game'
};

const COLORS = ['#9F9FED', '#EF4444', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#F97316', '#14B8A6'];

const ROW_COUNT = 15; // 사다리 행 수 (높이)
const COL_W = 80;    // 세로선 간격
const ROW_H = 30;    // 가로선 간격
const PAD_X = 40;    // 좌우 여백
const PAD_Y = 20;    // 상하 여백

export default function LadderGame({ players: initialPlayers, onReset }) {
  const [step, setStep] = useState(STEPS.PLAYERS);
  const [players, setPlayers] = useState(initialPlayers && initialPlayers.length >= 2 ? initialPlayers : ['철수', '영희']);
  const [outcomes, setOutcomes] = useState(['']); 
  
  // Game state
  const [ladder, setLadder] = useState(null);
  const [shuffledOutcomes, setShuffledOutcomes] = useState([]);
  const [resultMap, setResultMap] = useState(null); // resultMap[playerIdx] = outcomeIndex
  const [revealed, setRevealed] = useState([]);     // 공개 완료된 참여자 index
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 진행 중 여부
  const [showResult, setShowResult] = useState(null); // { name, outcome }
  const [nextToReveal, setNextToReveal] = useState(0); // 다음에 공개할 참여자 index
  const [showAllResults, setShowAllResults] = useState(false); // 전체 결과 팝업

  // Step 1: Players Logic
  const addPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, `참여자 ${players.length + 1}`]);
    }
  };

  const removePlayer = (index) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const goToOutcomes = () => {
    setOutcomes(['']); 
    setStep(STEPS.OUTCOMES);
  };

  // Step 2: Outcomes Logic
  const addOutcome = () => {
    if (outcomes.length < players.length) {
      setOutcomes([...outcomes, '']);
    }
  };

  const removeOutcome = (index) => {
    if (outcomes.length > 1) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  const updateOutcome = (index, text) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index] = text;
    setOutcomes(newOutcomes);
  };

  const startGame = () => {
    // 1. 결과값 채우기 ('통과' 포함)
    let processedOutcomes = outcomes.map(o => o.trim() === '' ? '통과' : o);
    const diff = players.length - processedOutcomes.length;
    if (diff > 0) {
      processedOutcomes = [...processedOutcomes, ...Array(diff).fill('통과')];
    }

    // 2. 결과 랜덤하게 섞기 (규칙 5번)
    const shuffled = shuffleArray(processedOutcomes);
    setShuffledOutcomes(shuffled);

    // 3. 사다리 데이터 생성
    const count = players.length;
    const newLadder = generateLadder(count, ROW_COUNT);
    
    // 4. 결과 매핑 계산
    // mapResults는 i번째 세로선의 끝이 몇 번째 세로선인지 반환
    const newResultMap = mapResults(newLadder, count);
    
    setLadder(newLadder);
    setResultMap(newResultMap);
    setRevealed([]);
    setNextToReveal(0);
    setShowAllResults(false);
    setStep(STEPS.GAME);
  };

  // Step 3: Game Logic
  const svgW = PAD_X * 2 + (players.length - 1) * COL_W;
  const svgH = PAD_Y * 2 + (ROW_COUNT + 1) * ROW_H;

  const handleRevealNext = () => {
    if (isAnimating || nextToReveal >= players.length) return;

    const playerIdx = nextToReveal;
    setIsAnimating(true);
    setRevealed([...revealed, playerIdx]);

    setTimeout(() => {
      setIsAnimating(false);
      setNextToReveal(playerIdx + 1);
      const outcome = shuffledOutcomes[resultMap[playerIdx]];
      // '통과'가 아닌 경우에만 팝업 표시
      if (outcome !== '통과') {
        setShowResult({ name: players[playerIdx], outcome });
      }
    }, 3200);
  };

  const resetGame = () => {
    setStep(STEPS.PLAYERS);
  };

  // 렌더링 도구들
  const xOf = (col) => PAD_X + col * COL_W;
  const yOf = (row) => PAD_Y + row * ROW_H;

  const renderStepPlayers = () => (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onReset}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className={styles.title}>참여자 명단 입력</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.cardList}>
          {players.map((name, i) => (
            <div key={i} className={styles.inputCard}>
              <div className={styles.inputFieldWrap}>
                <span className={styles.numberIcon}>{i + 1}</span>
                <input
                  className={styles.inputField}
                  value={name}
                  onChange={(e) => updatePlayer(i, e.target.value)}
                  placeholder={`참여자 ${i + 1}`}
                />
              </div>
              <button className={styles.deleteBtn} onClick={() => removePlayer(i)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ))}
          {players.length < 8 && (
            <button className={styles.addBtn} onClick={addPlayer}>
              <span className="material-symbols-outlined">add</span>
              인원 추가하기 ({players.length}/8)
            </button>
          )}
        </div>
      </main>
      <footer className={styles.footer}>
        <button className={styles.btnPrimary} onClick={goToOutcomes}>
          다음으로 (1/2)
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
    </div>
  );

  const renderStepOutcomes = () => (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => setStep(STEPS.PLAYERS)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className={styles.title}>사다리 설정 2단계</h1>
      </header>
      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>결과(벌칙/상품) 입력</h2>
        <div className={styles.cardList}>
          {outcomes.map((text, i) => (
            <div key={i} className={styles.inputCard}>
              <div style={{ flex: 1 }}>
                <label className={styles.resultLabel}>결과 {i + 1}</label>
                <input
                  className={styles.resultInput}
                  value={text}
                  onChange={(e) => updateOutcome(i, e.target.value)}
                  placeholder="벌칙/상품 입력 (미입력 시 '통과')"
                />
              </div>
              {outcomes.length > 1 && (
                <button className={styles.deleteBtn} style={{ marginTop: '24px' }} onClick={() => removeOutcome(i)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
          ))}
          {outcomes.length < players.length && (
            <button className={styles.addBtn} onClick={addOutcome}>
              <span className="material-symbols-outlined">add</span>
              결과 추가하기 ({outcomes.length}/{players.length})
            </button>
          )}
        </div>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px', textAlign: 'center' }}>
          * 입력한 결과들은 게임 시작 시 무작위로 배치됩니다.
        </p>
      </main>
      <footer className={styles.footer}>
        <button className={styles.btnSecondary} onClick={() => setStep(STEPS.PLAYERS)}>
          이전으로
        </button>
        <button className={styles.btnPrimary} onClick={startGame}>
          게임 시작하기 (2/2)
        </button>
      </footer>
    </div>
  );

  const renderStepGame = () => (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => setStep(STEPS.OUTCOMES)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className={styles.title}>사다리 타기</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.gameArea}>
          {/* 참여자 이름 - 세로선 위에 위치 (규칙 5) */}
          <div className={styles.playerNames}>
            {players.map((name, i) => (
              <div
                key={i}
                className={styles.playerName}
                style={{
                  color: revealed.includes(i) ? COLORS[i % COLORS.length] : '#64748b',
                  opacity: (isAnimating && revealed[revealed.length - 1] !== i) ? 0.4 : 1,
                  fontWeight: i === nextToReveal ? 800 : 600,
                }}
              >
                {name}
              </div>
            ))}
          </div>

          {/* 사다리 SVG - 사다리 그림과 경로가 100% 일치해야 함 (규칙 3) */}
          <div className={styles.svgArea}>
            <svg width={svgW} height={svgH} className={styles.svg}>
              {/* 세로선 */}
              {players.map((_, c) => (
                <line key={`v${c}`}
                  x1={xOf(c)} y1={0} x2={xOf(c)} y2={svgH}
                  stroke="#D4C1EC" strokeWidth="4" strokeLinecap="round"
                />
              ))}

              {/* 가로선 - 사다리 그림 고정 (규칙 4) */}
              {ladder.map((row, r) =>
                row.map((has, c) =>
                  has ? (
                    <line key={`h${r}${c}`}
                      x1={xOf(c)} y1={yOf(r + 1)} x2={xOf(c + 1)} y2={yOf(r + 1)}
                      stroke="#D4C1EC" strokeWidth="4" strokeLinecap="round"
                    />
                  ) : null
                )
              )}

              {/* 경로 애니메이션 - 1명씩 진행 (규칙 1), 긴장감 유지 (규칙 2) */}
              {revealed.map((playerIdx) => {
                const isCurrent = revealed.indexOf(playerIdx) === revealed.length - 1 && isAnimating;
                const path = tracePath(ladder, playerIdx);
                const points = path.map(({ col, row }) => `${xOf(col)},${yOf(row)}`).join(' ');
                
                return (
                  <polyline key={`path${playerIdx}`}
                    points={points}
                    fill="none"
                    stroke={COLORS[playerIdx % COLORS.length]}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="2000"
                    className={isCurrent ? styles.pathLineAnimating : styles.pathLine}
                  />
                );
              })}
            </svg>
          </div>

          {/* 결과 표시 - 세로선 아래에 무작위 배치 (규칙 5) */}
          <div className={styles.outcomeCards}>
            {shuffledOutcomes.map((text, c) => {
              // c번째 세로선 끝에 도착한 playerIdx 찾기
              const playerIdx = resultMap.indexOf(c);
              const isRevealed = revealed.includes(playerIdx) && (!isAnimating || revealed.indexOf(playerIdx) !== revealed.length - 1);
              
              return (
                <div key={c} className={styles.outcomeItem}>
                  <div className={styles.outcomeBox} style={{ borderColor: isRevealed ? COLORS[playerIdx % COLORS.length] : '#D4C1EC' }}>
                    <span className="material-symbols-outlined" style={{ color: isRevealed ? COLORS[playerIdx % COLORS.length] : '#D4C1EC' }}>
                      {text === '통과' ? 'close' : 'stars'}
                    </span>
                  </div>
                  <span className={styles.outcomeText} style={{ color: isRevealed ? COLORS[playerIdx % COLORS.length] : '#64748b' }}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={styles.btnSecondary} onClick={resetGame}>
          다시 하기
        </button>
        {nextToReveal < players.length ? (
          <button className={styles.btnPrimary} onClick={handleRevealNext} disabled={isAnimating}>
            {players[nextToReveal]} 시작
          </button>
        ) : (
          <button className={styles.btnPrimary} onClick={() => setShowAllResults(true)}>
            전체 결과 보기
          </button>
        )}
      </footer>

      {/* 개별 결과 팝업 (벌칙/상품일 때만) */}
      {showResult && (
        <div className={styles.overlay} onClick={() => setShowResult(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#9F9FED' }}>celebration</span>
            </div>
            <h3 className={styles.modalTitle}>게임 결과!</h3>
            <p className={styles.modalResult}>{showResult.name}: {showResult.outcome}!</p>
            <p className={styles.modalDesc}>
              축하합니다!<br/>오늘의 결과가 나왔습니다.
            </p>
            <button className={styles.modalCloseBtn} onClick={() => setShowResult(null)}>
              확인
            </button>
          </div>
        </div>
      )}

      {/* 전체 결과 팝업 */}
      {showAllResults && (
        <div className={styles.overlay} onClick={() => setShowAllResults(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#9F9FED' }}>leaderboard</span>
            </div>
            <h3 className={styles.modalTitle}>전체 결과</h3>
            <div className={styles.allResultsList}>
              {players.map((name, i) => (
                <div key={i} className={styles.allResultItem}>
                  <span className={styles.allResultName} style={{ color: COLORS[i % COLORS.length] }}>{name}</span>
                  <span className={styles.allResultOutcome}>{shuffledOutcomes[resultMap[i]]}</span>
                </div>
              ))}
            </div>
            <button className={styles.modalCloseBtn} onClick={() => setShowAllResults(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );

  switch (step) {
    case STEPS.PLAYERS: return renderStepPlayers();
    case STEPS.OUTCOMES: return renderStepOutcomes();
    case STEPS.GAME: return renderStepGame();
    default: return renderStepPlayers();
  }
}
