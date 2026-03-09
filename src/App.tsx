import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';

const heroes = [
  { id: 'h1', name: '李世民', desc: '普攻拉条', icon: '👑', unitType: '弓兵', role: '辅助' },
  { id: 'h2', name: '程咬金', desc: '残血锁血', icon: '🪓', unitType: '盾兵', role: '陷阵' },
  { id: 'h3', name: '李白', desc: '异常必杀', icon: '🗡️', unitType: '骑兵', role: '突袭' },
  { id: 'h4', name: '袁天罡', desc: '毒气推条', icon: '🔮', unitType: '弓兵', role: '奇谋' },
  { id: 'h5', name: '尉迟恭', desc: '重锤眩晕', icon: '🔨', unitType: '盾兵', role: '陷阵' },
  { id: 'h6', name: '秦琼', desc: '双锏破甲', icon: '⚔️', unitType: '枪兵', role: '勇武' },
  { id: 'h7', name: '薛仁贵', desc: '三箭定天山', icon: '🏹', unitType: '弓兵', role: '勇武' },
  { id: 'h8', name: '李靖', desc: '全军加速', icon: '📜', unitType: '骑兵', role: '统帅' },
  { id: 'h9', name: '苏定方', desc: '长途奔袭', icon: '🐎', unitType: '骑兵', role: '突袭' },
  { id: 'h10', name: '郭子仪', desc: '阵地坚守', icon: '🛡️', unitType: '盾兵', role: '统帅' },
  { id: 'h11', name: '狄仁杰', desc: '弱点识破', icon: '👁️', unitType: '弓兵', role: '辅助' },
  { id: 'h12', name: '武则天', desc: '威压全场', icon: '👑', unitType: '弓兵', role: '奇谋' },
  { id: 'h13', name: '杜甫', desc: '残血护盾', icon: '📖', unitType: '盾兵', role: '辅助' },
  { id: 'h14', name: '李淳风', desc: '星象预判', icon: '✨', unitType: '弓兵', role: '奇谋' },
  { id: 'h15', name: '王勃', desc: '士气高昂', icon: '✒️', unitType: '弓兵', role: '辅助' },
  { id: 'h16', name: '裴旻', desc: '剑舞连击', icon: '⚔️', unitType: '枪兵', role: '突袭' },
  { id: 'h17', name: '罗成', desc: '冷面寒枪', icon: '🔱', unitType: '骑兵', role: '突袭' },
  { id: 'h18', name: '柴绍', desc: '驸马军阵', icon: '🚩', unitType: '枪兵', role: '统帅' },
  { id: 'h19', name: '李勣', desc: '奇谋百出', icon: '🧠', unitType: '枪兵', role: '奇谋' },
  { id: 'h20', name: '侯君集', desc: '破城先锋', icon: '🧗', unitType: '枪兵', role: '陷阵' }
];

const runes = [
  { id: 'r1', name: '上指符', desc: '上方武将 +20 能量', icon: '🔼', effect: { type: 'directional', dx: 0, dy: -1, buff: '+20能' } },
  { id: 'r2', name: '下指符', desc: '下方武将 +20 能量', icon: '🔽', effect: { type: 'directional', dx: 0, dy: 1, buff: '+20能' } },
  { id: 'r3', name: '左指符', desc: '左侧武将 +50% 攻', icon: '◀️', effect: { type: 'directional', dx: -1, dy: 0, buff: '+50%攻' } },
  { id: 'r4', name: '右指符', desc: '右侧武将 +50% 攻', icon: '▶️', effect: { type: 'directional', dx: 1, dy: 0, buff: '+50%攻' } },
  { id: 'r7', name: '左上符', desc: '左上武将 +30% 暴击', icon: '↖️', effect: { type: 'directional', dx: -1, dy: -1, buff: '+30%暴' } },
  { id: 'r8', name: '左下符', desc: '左下武将 +30% 闪避', icon: '↙️', effect: { type: 'directional', dx: -1, dy: 1, buff: '+30%闪' } },
  { id: 'r9', name: '右上符', desc: '右上武将 +50% 暴伤', icon: '↗️', effect: { type: 'directional', dx: 1, dy: -1, buff: '+50%爆伤' } },
  { id: 'r10', name: '右下符', desc: '右下武将 +20% 吸血', icon: '↘️', effect: { type: 'directional', dx: 1, dy: 1, buff: '+20%吸血' } },
  { id: 'r5', name: '连珠符(右)', desc: '右侧两格武将加速', icon: '⏩', effect: { type: 'directional', dx: [1, 2], dy: [0, 0], buff: '+速度' } },
  { id: 'r6', name: '十字铁壁', desc: '四周武将 +免伤', icon: '💠', effect: { type: 'directional', dx: [0, 0, -1, 1], dy: [-1, 1, 0, 0], buff: '+免伤' } },
  { id: 'r11', name: '坚盾符', desc: '最近盾兵 +防御', icon: '🛡️', effect: { type: 'unit', targetUnit: '盾兵', targetCount: 1, buff: '+防御' } },
  { id: 'r12', name: '双弓符', desc: '最近2个弓兵 +射程', icon: '🏹', effect: { type: 'unit', targetUnit: '弓兵', targetCount: 2, buff: '+射程' } },
  { id: 'r13', name: '铁骑符', desc: '全部骑兵 +冲锋', icon: '🐎', effect: { type: 'unit', targetUnit: '骑兵', targetCount: 'all', buff: '+冲锋' } },
  { id: 'r14', name: '长枪符', desc: '全部枪兵 +破甲', icon: '🔱', effect: { type: 'unit', targetUnit: '枪兵', targetCount: 'all', buff: '+破甲' } },
  { id: 'r15', name: '陷阵符', desc: '最近陷阵 +破盾', icon: '🪓', effect: { type: 'role', targetRole: '陷阵', targetCount: 1, buff: '+破盾' } },
  { id: 'r16', name: '勇武符', desc: '全部勇武 +攻击', icon: '⚔️', effect: { type: 'role', targetRole: '勇武', targetCount: 'all', buff: '+攻击' } },
  { id: 'r17', name: '辅助符', desc: '最近2辅助 +治疗', icon: '🩹', effect: { type: 'role', targetRole: '辅助', targetCount: 2, buff: '+治疗' } },
  { id: 'r18', name: '奇谋符', desc: '全部奇谋 +法强', icon: '🔮', effect: { type: 'role', targetRole: '奇谋', targetCount: 'all', buff: '+法强' } },
  { id: 'r19', name: '突袭符', desc: '上方突袭 +暴击', icon: '🗡️', effect: { type: 'directional', dx: 0, dy: -1, targetRole: '突袭', buff: '+暴击' } },
  { id: 'r20', name: '统帅符', desc: '全部统帅 +免伤', icon: '帅', effect: { type: 'role', targetRole: '统帅', targetCount: 'all', buff: '+免伤' } }
];

const formations = {
  'fengshi': { name: '🗡️ 锋矢阵 (中路贯穿)', slots: [2, 6, 10, 14] },
  'sixiang': { name: '🛡️ 四象阵 (四角分散)', slots: [0, 3, 12, 15] },
  'yanyue': { name: '🌙 偃月阵 (前排铁壁)', slots: [12, 13, 14, 15] },
  'gushou': { name: '🏰 固守阵 (中心防御)', slots: [5, 6, 9, 10] },
  'fangyuan': { name: '⭕ 方圆阵 (环形包围)', slots: [1, 7, 8, 14] }
};

type ItemData = {
  type: 'hero' | 'rune';
  item: any;
};

const DraggableItem = ({ item, type }: { item: any, type: 'hero' | 'rune' }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, item }));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-[#2a2a35] border border-[#555] rounded-lg p-2.5 text-center cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-0.5 shadow-md border-l-4 ${
        type === 'hero' ? 'border-l-[#f6b93b] hover:border-[#f6b93b]' : 'border-l-[#82ccdd] hover:border-[#82ccdd]'
      }`}
    >
      <div className="text-xl mb-1">{item.icon}</div>
      <div className="font-bold text-sm text-white flex items-center justify-center gap-1 flex-wrap">
        {item.name}
        {type === 'hero' && (
          <>
            <span className="text-[10px] bg-gray-700 px-1 rounded text-gray-300 font-normal">{item.unitType}</span>
            <span className="text-[10px] bg-blue-900/80 px-1 rounded text-blue-200 font-normal">{item.role}</span>
          </>
        )}
      </div>
      <div className="text-[11px] text-gray-400 mt-1">{item.desc}</div>
    </div>
  );
};

const BoardSlot = ({ 
  index, 
  isHeroSlot, 
  data, 
  buffs, 
  isLocked,
  activeTab,
  onDrop, 
  onRemove,
  onUnlockClick,
  isShaking
}: { 
  index: number, 
  isHeroSlot: boolean, 
  data: ItemData | null, 
  buffs: string[], 
  isLocked: boolean,
  activeTab: 'hero' | 'rune',
  onDrop: (e: React.DragEvent, index: number, slotType: string) => void, 
  onRemove: (index: number) => void,
  onUnlockClick: (index: number) => void,
  isShaking: boolean
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const slotType = isHeroSlot ? 'hero' : 'rune';

  const handleDragOver = (e: React.DragEvent) => {
    if (isLocked) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    if (isLocked) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isLocked) return;
    setIsDragOver(false);
    onDrop(e, index, slotType);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (data && !isLocked) {
      e.dataTransfer.setData('application/json', JSON.stringify({ type: data.type, item: data.item, sourceIndex: index }));
    }
  };

  const handleClick = () => {
    if (isLocked) {
      onUnlockClick(index);
    }
  };

  const hasBuffs = buffs && buffs.length > 0;
  const isFocused = (isHeroSlot && activeTab === 'hero') || (!isHeroSlot && activeTab === 'rune');
  const borderStyle = isFocused ? 'border-solid' : 'border-dashed';

  return (
    <motion.div
      animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.3 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative rounded-lg flex flex-col items-center justify-center transition-all duration-300 text-xs w-full h-full ${
        isHeroSlot
          ? `border-2 ${borderStyle} border-[#f6b93b] bg-[#f6b93b]/10`
          : `border-2 ${borderStyle} border-[#82ccdd] bg-[#82ccdd]/10`
      } ${isDragOver ? 'bg-white/20 border-solid' : ''} ${
        hasBuffs ? 'shadow-[0_0_15px_#66fcf1] border-[#66fcf1] border-solid' : ''
      } ${isLocked ? 'cursor-pointer hover:bg-white/5' : ''}`}
    >
      <div className="absolute top-1 left-1.5 text-[10px] text-gray-500/60 font-mono pointer-events-none z-20">
        {index}
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-10">
          <span className="text-xl">🔒</span>
        </div>
      )}

      {!data && !isLocked && (
        <span className="text-gray-500">{isHeroSlot ? '武将' : '阵符'}</span>
      )}
      
      {data && !isLocked && (
        <motion.div
          draggable
          onDragStart={handleDragStart}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-md cursor-grab active:cursor-grabbing ${
            data.type === 'hero'
              ? 'bg-gradient-to-br from-[#f6b93b]/20 to-[#f6b93b]/5 border-2 border-[#f6b93b] shadow-[0_0_10px_rgba(246,185,59,0.2)]'
              : 'bg-gradient-to-br from-[#82ccdd]/20 to-[#82ccdd]/5 border border-[#82ccdd]'
          }`}
        >
          <div className="text-2xl">{data.item.icon}</div>
          <div className="font-bold text-white flex items-center justify-center gap-1 flex-wrap">
            {data.item.name}
            {data.type === 'hero' && (
              <>
                <span className="text-[10px] bg-gray-700/80 px-1 rounded text-gray-300 font-normal">{data.item.unitType}</span>
                <span className="text-[10px] bg-blue-900/80 px-1 rounded text-blue-200 font-normal">{data.item.role}</span>
              </>
            )}
          </div>
          
          {data.type === 'hero' && hasBuffs && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-md flex flex-col gap-0.5">
              {buffs.map((buff, i) => (
                <div key={i} className="text-[#66fcf1] drop-shadow-md whitespace-nowrap">{buff}</div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default function App() {
  const [formation, setFormation] = useState<keyof typeof formations>('fengshi');
  const [board, setBoard] = useState<(ItemData | null)[]>(Array(16).fill(null));
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'rune'>('hero');
  
  const [formationStates, setFormationStates] = useState<Record<string, { level: number, unlockedSlots: number[] }>>({
    fengshi: { level: 1, unlockedSlots: [] },
    sixiang: { level: 1, unlockedSlots: [] },
    yanyue: { level: 1, unlockedSlots: [] },
    gushou: { level: 1, unlockedSlots: [] },
    fangyuan: { level: 1, unlockedSlots: [] }
  });
  const [unlockPrompt, setUnlockPrompt] = useState<number | null>(null);

  const currentFormationState = formationStates[formation];
  const availablePoints = currentFormationState.level - 1 - currentFormationState.unlockedSlots.length;

  const handleUpgrade = () => {
    setFormationStates(prev => ({
      ...prev,
      [formation]: {
        ...prev[formation],
        level: prev[formation].level + 1
      }
    }));
  };

  const handleResetPoints = () => {
    const newBoard = [...board];
    currentFormationState.unlockedSlots.forEach(idx => {
      newBoard[idx] = null;
    });
    setBoard(newBoard);
    setFormationStates(prev => ({
      ...prev,
      [formation]: {
        ...prev[formation],
        unlockedSlots: []
      }
    }));
  };

  const handleUnlockClick = (index: number) => {
    setUnlockPrompt(index);
  };

  const confirmUnlock = () => {
    if (unlockPrompt !== null && availablePoints > 0) {
      setFormationStates(prev => ({
        ...prev,
        [formation]: {
          ...prev[formation],
          unlockedSlots: [...prev[formation].unlockedSlots, unlockPrompt]
        }
      }));
    }
    setUnlockPrompt(null);
  };

  const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormation(e.target.value as keyof typeof formations);
    setBoard(Array(16).fill(null));
  };

  const clearBoard = () => {
    setBoard(Array(16).fill(null));
  };

  const handleDrop = (e: React.DragEvent, index: number, slotType: string) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('application/json');
    if (!dataStr) return;
    
    try {
      const data = JSON.parse(dataStr) as ItemData & { sourceIndex?: number };
      if (data.type !== slotType) {
        setShakeIndex(index);
        setTimeout(() => setShakeIndex(null), 300);
        return;
      }
      
      const newBoard = [...board];
      if (data.sourceIndex !== undefined) {
        // Swap with existing item if dragged from another slot
        const existingItem = newBoard[index];
        newBoard[index] = { type: data.type, item: data.item };
        newBoard[data.sourceIndex] = existingItem;
      } else {
        newBoard[index] = { type: data.type, item: data.item };
      }
      setBoard(newBoard);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = (index: number) => {
    const newBoard = [...board];
    newBoard[index] = null;
    setBoard(newBoard);
  };

  const buffs = useMemo(() => {
    const newBuffs: string[][] = Array(16).fill([]);
    
    board.forEach((data, i) => {
      if (!data || data.type !== 'rune') return;
      
      const effect = data.item.effect;
      const runeX = i % 4;
      const runeY = Math.floor(i / 4);
      
      if (!effect.type || effect.type === 'directional') {
        const dxArray = Array.isArray(effect.dx) ? effect.dx : [effect.dx];
        const dyArray = Array.isArray(effect.dy) ? effect.dy : [effect.dy];
        
        dxArray.forEach((dx, idx) => {
          const dy = dyArray[idx];
          const targetX = runeX + dx;
          const targetY = runeY + dy;
          
          if (targetX >= 0 && targetX < 4 && targetY >= 0 && targetY < 4) {
            const targetIndex = targetY * 4 + targetX;
            const targetData = board[targetIndex];
            
            if (targetData && targetData.type === 'hero') {
              const matchRole = !effect.targetRole || targetData.item.role === effect.targetRole;
              const matchUnit = !effect.targetUnit || targetData.item.unitType === effect.targetUnit;
              if (matchRole && matchUnit) {
                newBuffs[targetIndex] = [...newBuffs[targetIndex], effect.buff];
              }
            }
          }
        });
      } else if (effect.type === 'unit' || effect.type === 'role') {
        const matchKey = effect.type === 'unit' ? 'unitType' : 'role';
        const matchValue = effect.type === 'unit' ? effect.targetUnit : effect.targetRole;
        
        const matchingHeroes = board
          .map((item, idx) => ({ item, idx }))
          .filter(obj => obj.item && obj.item.type === 'hero' && obj.item.item[matchKey] === matchValue)
          .map(obj => {
            const hX = obj.idx % 4;
            const hY = Math.floor(obj.idx / 4);
            const dist = Math.abs(hX - runeX) + Math.abs(hY - runeY);
            return { idx: obj.idx, dist };
          });
          
        if (effect.targetCount === 'all') {
          matchingHeroes.forEach(h => {
            newBuffs[h.idx] = [...newBuffs[h.idx], effect.buff];
          });
        } else {
          matchingHeroes.sort((a, b) => a.dist - b.dist);
          const targets = matchingHeroes.slice(0, effect.targetCount);
          targets.forEach(h => {
            newBuffs[h.idx] = [...newBuffs[h.idx], effect.buff];
          });
        }
      }
    });
    
    return newBuffs;
  }, [board]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans p-5 flex flex-col items-center select-none">
      <h1 className="text-[#66fcf1] text-3xl font-bold mb-1 drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]">
        《河图：唐破阵志》
      </h1>
      <div className="text-[#45a29e] text-sm mb-5">
        河图演万象，玄甲破千阵
      </div>

      <div className="flex gap-5 w-full max-w-6xl items-stretch">
        {/* Left Panel - Config Area */}
        <div className="flex-1 bg-[#1f2833] rounded-xl p-4 border border-gray-800 flex flex-col">
          <div className="flex border-b border-gray-700 mb-4">
            <button
              onClick={() => setActiveTab('hero')}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${
                activeTab === 'hero' 
                  ? 'text-[#f6b93b] border-b-2 border-[#f6b93b]' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              武将
            </button>
            <button
              onClick={() => setActiveTab('rune')}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${
                activeTab === 'rune' 
                  ? 'text-[#82ccdd] border-b-2 border-[#82ccdd]' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              阵符
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[600px]">
            <div className="grid grid-cols-3 gap-2.5">
              {activeTab === 'hero' 
                ? heroes.map(hero => <DraggableItem key={hero.id} item={hero} type="hero" />)
                : runes.map(rune => <DraggableItem key={rune.id} item={rune} type="rune" />)
              }
            </div>
          </div>
        </div>

        {/* Right Panel - Board */}
        <div className="w-[460px] shrink-0 bg-[#1f2833] rounded-xl p-4 border border-gray-800 flex flex-col items-center justify-start relative">
          {unlockPrompt !== null && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 rounded-xl backdrop-blur-sm">
              <div className="bg-[#1f2833] border border-[#45a29e] p-6 rounded-xl shadow-2xl max-w-sm w-full">
                <h3 className="text-xl font-bold text-white mb-4">解锁阵符槽</h3>
                {availablePoints > 0 ? (
                  <p className="text-gray-300 mb-6">
                    是否消耗 <span className="text-[#66fcf1] font-bold">1</span> 点阵法点解锁该位置？
                    <br/>
                    当前剩余点数: {availablePoints}
                  </p>
                ) : (
                  <p className="text-red-400 mb-6">
                    阵法点不足！请先点击“升级”按钮提升阵法等级。
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setUnlockPrompt(null)}
                    className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                  >
                    取消
                  </button>
                  {availablePoints > 0 && (
                    <button 
                      onClick={confirmUnlock}
                      className="px-4 py-2 rounded bg-[#45a29e] text-white hover:bg-[#66fcf1] hover:text-black font-bold transition-colors"
                    >
                      确认解锁
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 grid-rows-4 gap-2 bg-[#111] p-4 rounded-xl border-2 border-gray-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] w-[400px] h-[400px] mb-6 mt-2">
            {Array.from({ length: 16 }).map((_, i) => {
              const isHeroSlot = formations[formation].slots.includes(i);
              const isLocked = !isHeroSlot && !currentFormationState.unlockedSlots.includes(i);
              
              return (
                <BoardSlot 
                  key={i}
                  index={i}
                  isHeroSlot={isHeroSlot}
                  data={board[i]}
                  buffs={buffs[i]}
                  isLocked={isLocked}
                  activeTab={activeTab}
                  onDrop={handleDrop}
                  onRemove={removeItem}
                  onUnlockClick={handleUnlockClick}
                  isShaking={shakeIndex === i}
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-3 w-full px-4">
            <div className="flex justify-between items-center w-full">
              <select 
                value={formation} 
                onChange={handleFormationChange}
                className="bg-[#0b0c10] text-[#66fcf1] border border-[#66fcf1] px-3 py-1.5 rounded-md cursor-pointer font-bold outline-none hover:bg-[#66fcf1] hover:text-black transition-colors"
              >
                {Object.entries(formations).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>

              <button 
                onClick={clearBoard}
                className="bg-[#0b0c10] text-red-400 border border-red-900 px-3 py-1.5 rounded-md cursor-pointer font-bold outline-none hover:bg-red-900 hover:text-white transition-colors text-sm"
              >
                🗑️ 清空
              </button>
            </div>

            <div className="flex justify-between items-center w-full bg-[#0b0c10] border border-gray-700 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-[#f6b93b] font-bold text-sm">Lv.{currentFormationState.level}</span>
                <span className="text-gray-400 text-xs">|</span>
                <span className="text-[#66fcf1] font-bold text-sm">点数: {availablePoints}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleUpgrade}
                  className="bg-[#45a29e] text-white px-3 py-1.5 rounded-md cursor-pointer font-bold outline-none hover:bg-[#66fcf1] hover:text-black transition-colors text-sm"
                >
                  ⬆️ 升级
                </button>
                
                <button 
                  onClick={handleResetPoints}
                  className="bg-gray-700 text-white px-3 py-1.5 rounded-md cursor-pointer font-bold outline-none hover:bg-gray-600 transition-colors text-sm"
                >
                  🔄 重置
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-5 mt-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded-sm bg-[#f6b93b]/10 border ${activeTab === 'hero' ? 'border-solid' : 'border-dashed'} border-[#f6b93b]`}></div>
              武将插槽
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded-sm bg-[#82ccdd]/10 border ${activeTab === 'rune' ? 'border-solid' : 'border-dashed'} border-[#82ccdd]`}></div>
              阵符插槽
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
