import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import React from 'react';

type Rank = '신화' | '전설' | '영웅' | '희귀' | '고급' | '일반';

interface GachaCard {
  rank: Rank;
  option: string;
  id: number;
  locked: boolean;
}

interface OptionData {
  name: string;
  probability: number;
}

// 진짜 카드 위치
const position = [1,2,3,8,9,4,7,6,5]

// 각 카드 위치별 옵션 테이블
const CARD_OPTIONS: Record<number, OptionData[]> = {
  0: [ // 1번 카드
    { name: '생명력', probability: 0.033 },
    { name: '방어력', probability: 0.05 },
    { name: '모든속성 저항', probability: 0.05 },
    { name: '생명력 회복', probability: 0.289 },
    { name: '마나 회복', probability: 0.289 },
    { name: '경험치 획득량', probability: 0.289 },
  ],
  1: [ // 2번 카드
    { name: '방어력', probability: 0.033 },
    { name: '생명력', probability: 0.05 },
    { name: '모든속성 저항', probability: 0.05 },
    { name: '적생', probability: 0.289 },
    { name: '처생', probability: 0.289 },
    { name: '은화 획득량', probability: 0.289 },
  ],
  2: [ // 3번 카드
    { name: '공격력', probability: 0.033 },
    { name: '최종 피해량', probability: 0.05 },
    { name: '치명타 피해량', probability: 0.05 },
    { name: '생명력', probability: 0.289 },
    { name: '방어력', probability: 0.289 },
    { name: '모든속성 저항', probability: 0.289 },
  ],
  3: [ // 4번 카드
    { name: '모든속성 저항', probability: 0.033 },
    { name: '생명력', probability: 0.05 },
    { name: '방어력', probability: 0.05 },
    { name: '아이템 획득 확률', probability: 0.289 },
    { name: '경험치 획득량', probability: 0.289 },
    { name: '은화 획득량', probability: 0.289 },
  ],
  4: [ // 5번 카드
    { name: '최종 피해량', probability: 0.033 },
    { name: '공격력', probability: 0.05 },
    { name: '모든속성 강화', probability: 0.05 },
    { name: '생명력', probability: 0.289 },
    { name: '방어력', probability: 0.289 },
    { name: '모든속성 저항', probability: 0.289 },
  ],
  5: [ // 6번 카드
    { name: '방어력', probability: 0.033 },
    { name: '생명력', probability: 0.05 },
    { name: '모든속성 저항', probability: 0.05 },
    { name: '적생', probability: 0.289 },
    { name: '처생', probability: 0.289 },
    { name: '은화 획득량', probability: 0.289 },
  ],
  6: [ // 7번 카드
    { name: '이동속도', probability: 0.033 },
    { name: '최종 피해량', probability: 0.05 },
    { name: '치명타 피해량', probability: 0.05 },
    { name: '생명력', probability: 0.289 },
    { name: '방어력', probability: 0.289 },
    { name: '모든속성 저항', probability: 0.289 },
  ],
  7: [ // 8번 카드
    { name: '치명타 피해량', probability: 0.033 },
    { name: '이동속도', probability: 0.05 },
    { name: '공격력', probability: 0.05 },
    { name: '생명력', probability: 0.289 },
    { name: '방어력', probability: 0.289 },
    { name: '모든속성 저항', probability: 0.289 },
  ],
  8: [ // 9번 카드
    { name: '최종 피해량', probability: 0.033 },
    { name: '모든속성 강화', probability: 0.05 },
    { name: '이동속도', probability: 0.05 },
    { name: '생명력', probability: 0.289 },
    { name: '방어력', probability: 0.289 },
    { name: '모든속성 저항', probability: 0.289 },
  ],
};

const RANK_VALUES: Record<Rank, number> = {
  '신화': 6,
  '전설': 5,
  '영웅': 4,
  '희귀': 3,
  '고급': 2,
  '일반': 1,
};

const RANK_COLORS: Record<Rank, string> = {
  '신화': 'bg-gradient-to-br from-red-700 to-pink-800',
  '전설': 'bg-gradient-to-br from-yellow-600 to-orange-700',
  '영웅': 'bg-gradient-to-br from-purple-600 to-pink-700',
  '희귀': 'bg-gradient-to-br from-blue-600 to-cyan-700',
  '고급': 'bg-gradient-to-br from-green-700 to-emerald-800',
  '일반': 'bg-gradient-to-br from-gray-600 to-slate-700',
};

const RANK_BONUS: Record<Rank, number> = {
  '신화': 130000,
  '전설': 45000,
  '영웅': 15000,
  '희귀': 7500,
  '고급': 3500,
  '일반': 2000,
};

const RANK_PROBABILITIES: Record<Rank, number> = {
  '신화': 0.01,
  '전설': 0.05,
  '영웅': 0.10,
  '희귀': 0.20,
  '고급': 0.30,
  '일반': 0.34,
};


function getRandomRank(): Rank {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [rank, probability] of Object.entries(RANK_PROBABILITIES)) {
    cumulative += probability;
    if (random <= cumulative) {
      return rank as Rank;
    }
  }
  
  return '일반';
}

function getRandomOption(cardIndex: number): string {
  const options = CARD_OPTIONS[cardIndex];
  const random = Math.random()
  let cumulative = 0;
  
  for (const optionData of options) {
    cumulative += optionData.probability;
    if (random <= cumulative) {
      return optionData.name;
    }
  }
  
  // fallback
  return options[options.length - 1].name;
}

export default function App() {
  const [cards, setCards] = useState<GachaCard[]>([]);
  const [rowBonuses, setRowBonuses] = useState<Rank[]>([]);
  const [colBonuses, setColBonuses] = useState<Rank[]>([]);
  const [diagBonus, setDiagBonus] = useState<Rank>('일반');
  const [autoRoll, setAutoRoll] = useState(false);
  const [targetRank, setTargetRank] = useState<Rank>('신화');
  // rank 등급 비교 함수
  const isRankAtLeast = (rank: Rank, target: Rank) => {
    return RANK_VALUES[rank] >= RANK_VALUES[target];
  };
  const [isRolling, setIsRolling] = useState(false);
  const [totalPowder, setTotalPowder] = useState(0);
  const [totalStamp, setTotalStamp] = useState(0);

  const getStampCost = (lockedCount: number): number => {
    if (lockedCount === 0) return 0;
    if (lockedCount <= 2) return 1;
    if (lockedCount <= 4) return 3;
    if (lockedCount <= 6) return 5;
    return 6;
  };

  const toggleLock = (index: number) => {
    if (cards.length === 0) return;
    index = position[index] - 1
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], locked: !newCards[index].locked };
    setCards(newCards);
  };

  const rollGacha = () => {
    setIsRolling(true);
    // 잠금 개수 계산
    const lockedCount = cards.filter(card => card.locked).length;
    const stampCost = getStampCost(lockedCount);
    
    // 소모 아이템 누적
    setTotalPowder(prev => prev + 100);
    setTotalStamp(prev => prev + stampCost);
    
    const newCards: GachaCard[] = Array.from({ length: 9 }, (_, i) => {
      // 이미 카드가 있고 잠겨있으면 기존 카드 유지
      if (cards[i] && cards[i].locked) {
        return cards[i];
      }
      const option = getRandomOption(i);
      const rank = getRandomRank();
      return {
        rank: rank,
        option: option,
        id: Date.now() + i,
        locked: false,
      };
    });
    
    setTimeout(() => {
      setCards(newCards);
      calculateBonus(newCards);
      // 연속 뽑기: cards 중 targetRank 이상이 있으면 멈춤, 없으면 계속
      if (autoRoll && (!newCards.some(card => 
                        !card.locked && isRankAtLeast(card.rank, targetRank))))
        rollGacha();
      else
        setIsRolling(false);
    }, 100);
  };

  const calculateBonus = (cardArray: GachaCard[]) => {
    const rows: Rank[] = [];
    const cols: Rank[] = [];
    
    // 각 행의 최저 등급
    for (let row = 0; row < 3; row++) {
      const rowCards = [cardArray[row * 3], cardArray[row * 3 + 1], cardArray[row * 3 + 2]];
      const minRank = rowCards.reduce((min, card) => 
        RANK_VALUES[card.rank] < RANK_VALUES[min.rank] ? card : min
      ).rank;
      rows.push(minRank);
    }
    
    // 각 열의 최저 등급
    for (let col = 0; col < 3; col++) {
      const colCards = [cardArray[col], cardArray[col + 3], cardArray[col + 6]];
      const minRank = colCards.reduce((min, card) => 
        RANK_VALUES[card.rank] < RANK_VALUES[min.rank] ? card : min
      ).rank;
      cols.push(minRank);
    }
    
    // 대각선 (좌상->우하, \ 모양)
    const diagCards = [cardArray[0], cardArray[4], cardArray[8]];
    const minRank = diagCards.reduce((min, card) => 
      RANK_VALUES[card.rank] < RANK_VALUES[min.rank] ? card : min
    ).rank;
    const diag = minRank;
    
    setRowBonuses(rows);
    setColBonuses(cols);
    setDiagBonus(diag);
  };

  const reset = () => {
    setCards([]);
    setRowBonuses([]);
    setColBonuses([]);
    setDiagBonus('일반');
    setTotalPowder(0);
    setTotalStamp(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">아르카나 시뮬레이터</h1>
          {totalPowder > 0 && (
            <p className="text-slate-400 text-sm mt-2">누적 소모 아이템: {totalPowder.toLocaleString()} 가루, {totalStamp.toLocaleString()} 스탬프 (총 {(totalPowder + totalStamp * 1000).toLocaleString()} 가루, {((Math.ceil(totalPowder + totalStamp * 1000) / 11.52) / 100).toLocaleString()} 일)</p>
          )}
        </div>

        <Card className="p-8 bg-slate-800/50 backdrop-blur border-slate-700">
          {/* 4x4 가챠 그리드 (3x3 카드 + 보너스 표시) */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {/* 3x3 카드 그리드 */}
            {Array.from({ length: 3 }).map((_, row) => (
              <React.Fragment key={`row-${row}`}>
                {Array.from({ length: 3 }).map((_, col) => {
                  const index = row * 3 + col;
                  const card = cards[position[index] - 1];
                  
                  return (
                    <div
                      key={`card-${row}-${col}`}
                      onClick={() => toggleLock(index)}
                      className={card 
                        ? `aspect-square rounded-xl ${RANK_COLORS[card.rank]} border-2 ${card.locked ? 'border-white border-4' : 'border-white/20'} flex items-center justify-center shadow-lg transform transition-all duration-500 cursor-pointer relative`
                        : "aspect-square rounded-xl bg-slate-700/50 border-2 border-slate-600 flex items-center justify-center"
                      }
                    >
                      <span className={card ? "text-white text-sm font-bold drop-shadow-lg px-2 text-center" : "text-slate-500 text-4xl"}>
                        {card ? card.option : '?'}
                      </span>
                      {card && card.locked && (
                        <div className="absolute top-1 right-1 bg-white/80 rounded-full p-1">
                          <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* 행 보너스 */}
                <div className={`aspect-square rounded-xl ${RANK_COLORS[rowBonuses[row]]} border-2 border-yellow-500/30 flex flex-col items-center justify-center`}>
                  {rowBonuses[row] !== undefined ? (
                    <>
                      <span className="text-white text-xs mb-1">{["최피", "치피", "이속"][row]}</span>
                      <span className="text-green-400 font-bold">+{RANK_BONUS[rowBonuses[row]]}</span>
                    </>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </div>
              </React.Fragment>
            ))}
            
            {/* 열 보너스 */}
            {Array.from({ length: 3 }).map((_, col) => (
              <div key={`col-${col}`} className={`aspect-square rounded-xl ${RANK_COLORS[colBonuses[col]]} border-2 border-blue-500/30 flex flex-col items-center justify-center`}>
                {colBonuses[col] !== undefined ? (
                  <>
                    <span className="text-white text-xs mb-1">{["치피", "모속강", "공"][col]}</span>
                    <span className="text-green-400 font-bold">+{RANK_BONUS[colBonuses[col]]}</span>
                  </>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </div>
            ))}
            
            {/* 대각선 보너스 */}
            <div className="aspect-square rounded-xl bg-purple-500/20 border-2 border-purple-500/30 flex flex-col items-center justify-center gap-1">
              {diagBonus ? (
                <>
                  <div className="text-center">
                    <span className="text-purple-400 text-xs">빛의 속도</span>
                  </div>
                </>
              ) : (
                <span className="text-slate-500">-</span>
              )}
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3">
            <Button
              onClick={rollGacha}
              disabled={isRolling}
              className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isRolling ? '뽑는 중...' : `가챠 뽑기 (가루 100, 스탬프 ${getStampCost(cards.filter(c => c.locked).length)})`}
            </Button>
            {cards.length > 0 && (
              <Button
                onClick={reset}
                variant="outline"
                className="h-14 px-6 border-slate-600 hover:bg-slate-700"
              >
                초기화
              </Button>
            )}
          </div>
          {/* 연속 뽑기 옵션 UI */}
          <div className="flex items-center gap-4 mb-4 justify-center">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={autoRoll}
                onChange={e => setAutoRoll(e.target.checked)}
              />
              연속 뽑기
            </label>
            <select
              className="bg-slate-700 text-white rounded px-2 py-1"
              value={targetRank}
              onChange={e => setTargetRank(e.target.value as Rank)}
            >
              <option value="신화">신화 이상</option>
              <option value="전설">전설 이상</option>
              <option value="영웅">영웅 이상</option>
              <option value="희귀">희귀 이상</option>
              <option value="고급">고급 이상</option>
              <option value="일반">일반 이상</option>
            </select>
          </div>
        </Card>
      </div>
    </div>
  );
}