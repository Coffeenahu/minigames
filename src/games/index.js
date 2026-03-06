import { lazy } from 'react';

export const GAMES = [
  {
    id: 'coin',
    name: '동전던지기',
    icon: '🪙',
    description: '앞면이냐 뒷면이냐, 운명의 동전을 던져라!',
    color: '#9F9FED',
    minPlayers: 2,
    maxPlayers: 2,
    component: lazy(() => import('./coin/CoinGame')),
  },
  {
    id: 'dice',
    name: '주사위던지기',
    icon: '🎲',
    description: '주사위를 굴려 가장 높은 숫자를 뽑아라!',
    color: '#9F9FED',
    minPlayers: 1,
    maxPlayers: null,
    component: lazy(() => import('./dice/DiceGame')),
  },
  {
    id: 'pirate',
    name: '해적룰렛',
    icon: '☠️',
    description: '칼을 꽂아라. 배럴이 폭발하면 탈락!',
    color: '#9F9FED',
    minPlayers: 2,
    maxPlayers: 6,
    component: lazy(() => import('./pirate/PirateGame')),
  },
  {
    id: 'ladder',
    name: '사다리 타기',
    icon: '🪜',
    description: '사다리를 타고 내려가 운명의 결과를 확인하라!',
    color: '#9F9FED',
    minPlayers: 2,
    maxPlayers: 8,
    component: lazy(() => import('./ladder/LadderGame')),
  },
];

export const getGame = (id) => GAMES.find((g) => g.id === id) ?? null;
