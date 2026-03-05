/** 사다리 생성 */
export function generateLadder(colCount, rowCount = 10) {
  const rows = [];
  for (let r = 0; r < rowCount; r++) {
    const row = Array(colCount - 1).fill(false);
    for (let c = 0; c < colCount - 1; c++) {
      // 이전 칸이 가로줄이면 건너뜀 (인접 가로줄 방지)
      if (c > 0 && row[c - 1]) continue;
      row[c] = Math.random() < 0.45;
    }
    rows.push(row);
  }
  return rows;
}

/** 경로 추적: startCol → endCol, 각 스텝 좌표 반환 */
export function tracePath(rows, startCol) {
  const path = [{ col: startCol, row: 0 }];
  let col = startCol;
  for (let r = 0; r < rows.length; r++) {
    // 왼쪽 가로줄
    if (col > 0 && rows[r][col - 1]) {
      col -= 1;
    }
    // 오른쪽 가로줄
    else if (col < rows[0].length && rows[r][col]) {
      col += 1;
    }
    path.push({ col, row: r + 1 });
  }
  return path;
}

/** 모든 참가자 결과 매핑: startCol → endCol */
export function mapResults(rows, count) {
  return Array.from({ length: count }, (_, i) => {
    const path = tracePath(rows, i);
    return path[path.length - 1].col;
  });
}
