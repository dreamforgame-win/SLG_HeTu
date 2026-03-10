import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { heroes, runes, formations } from './data';
import { BattleEngine, BattleLog, BattleState } from './BattleEngine';

type ItemData = {
  type: 'hero' | 'rune';
  item: any;
};

const DraggableItem = ({ item, type, onClick }: { key?: React.Key, item: any, type: 'hero' | 'rune', onClick?: () => void }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, item }));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
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
  onHeroClick,
  isShaking
}: { 
  key?: React.Key,
  index: number, 
  isHeroSlot: boolean, 
  data: ItemData | null, 
  buffs: string[], 
  isLocked: boolean,
  activeTab: 'hero' | 'rune',
  onDrop: (e: React.DragEvent, index: number, slotType: string) => void, 
  onRemove: (index: number) => void,
  onUnlockClick: (index: number) => void,
  onHeroClick: (hero: any) => void,
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
    } else if (data && data.type === 'hero') {
      onHeroClick(data.item);
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
      className={`relative rounded-lg flex flex-col items-center justify-center transition-all duration-300 text-xs w-full h-full border-2 ${
        isShaking 
          ? 'border-red-500 shadow-[0_0_15px_#ef4444] border-solid'
          : isHeroSlot
            ? `${borderStyle} border-[#f6b93b] bg-[#f6b93b]/10`
            : `${borderStyle} border-[#82ccdd] bg-[#82ccdd]/10`
      } ${isDragOver ? 'bg-white/20 border-solid' : ''} ${
        hasBuffs && !isShaking ? 'shadow-[0_0_15px_#66fcf1] border-[#66fcf1] border-solid' : ''
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
              : 'bg-gradient-to-br from-[#82ccdd]/40 to-[#82ccdd]/10 border border-[#82ccdd]'
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

const calculateBuffs = (boardState: (ItemData | null)[]) => {
  const newBuffs: string[][] = Array(16).fill([]);
  
  boardState.forEach((data, i) => {
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
          const targetData = boardState[targetIndex];
          
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
      
      const matchingHeroes = boardState
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
};

const BattleSlot = ({
  index,
  data,
  buffs,
  col,
  row,
  isHeroSlot,
  isEnemy,
  battleState,
  currentAction
}: {
  key?: React.Key;
  index: number;
  data: ItemData | null;
  buffs: string[];
  col: number;
  row: number;
  isHeroSlot: boolean;
  isEnemy?: boolean;
  battleState?: BattleState;
  currentAction?: BattleLog['action'];
}) => {
  const hasBuffs = buffs && buffs.length > 0;
  
  const heroState = battleState?.find(h => 
    h.position === index && 
    h.team === (isEnemy ? 'enemy' : 'player')
  );

  const hpPercent = heroState ? Math.max(0, (heroState.current_hp / heroState.max_hp) * 100) : 100;
  const energyPercent = heroState ? Math.min(100, heroState.energy) : 0;
  const isDead = heroState && heroState.current_hp <= 0;
  
  const isAttacking = currentAction?.sourceId === heroState?.id && (currentAction?.type === 'normal' || currentAction?.type === 'ultimate');
  const isTargeted = currentAction?.targetId === heroState?.id || currentAction?.targetIds?.includes(heroState?.id || '');
  const isTakingDamage = currentAction?.type === 'damage' && isTargeted;
  const isHealing = currentAction?.type === 'heal' && isTargeted;

  return (
    <motion.div
      style={{ gridColumn: col, gridRow: row }}
      animate={
        isAttacking ? { x: isEnemy ? -20 : 20, scale: 1.1, zIndex: 10 } :
        isTakingDamage ? { x: [-5, 5, -5, 5, 0], filter: 'brightness(1.5) sepia(1) hue-rotate(-50deg) saturate(5)' } :
        isHealing ? { filter: 'brightness(1.5) sepia(1) hue-rotate(90deg) saturate(3)' } :
        { x: 0, scale: 1, filter: 'none', zIndex: 1 }
      }
      transition={{ duration: 0.3 }}
      className={`relative rounded-lg flex flex-col items-center justify-center transition-all duration-300 text-xs w-full h-full ${
        isHeroSlot
          ? isEnemy ? 'border-2 border-dashed border-red-900/50 bg-red-900/10' : 'border-2 border-dashed border-[#f6b93b] bg-[#f6b93b]/10'
          : 'border-2 border-dashed border-transparent bg-[#82ccdd]/5'
      } ${
        (isHeroSlot && hasBuffs) ? (isEnemy ? 'shadow-[0_0_15px_#ef4444] border-[#ef4444] border-solid' : 'shadow-[0_0_15px_#66fcf1] border-[#66fcf1] border-solid') : ''
      } ${isDead ? 'opacity-30 grayscale' : ''} ${isTargeted ? 'ring-4 ring-red-500 ring-opacity-50' : ''}`}
    >
      {data && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-md ${
            data.type === 'hero'
              ? isEnemy 
                ? 'bg-gradient-to-br from-red-900/40 to-red-900/10 border-2 border-red-700 shadow-[0_0_10px_rgba(185,28,28,0.3)]'
                : 'bg-gradient-to-br from-[#f6b93b]/20 to-[#f6b93b]/5 border-2 border-[#f6b93b] shadow-[0_0_10px_rgba(246,185,59,0.2)]'
              : 'bg-gradient-to-br from-[#82ccdd]/40 to-[#82ccdd]/10 border border-[#82ccdd] opacity-60 grayscale'
          }`}
        >
          <div className="text-2xl">{data.item.icon}</div>
          <div className="font-bold text-white flex items-center justify-center gap-1 flex-wrap px-1 text-center">
            {data.item.name}
          </div>
          
          {isTakingDamage && currentAction?.value && (
            <motion.div 
              initial={{ opacity: 1, y: 0, scale: 1.5 }}
              animate={{ opacity: 0, y: -30, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute text-red-500 font-black text-lg drop-shadow-[0_0_5px_rgba(0,0,0,1)] z-50 pointer-events-none"
            >
              -{currentAction.value}
            </motion.div>
          )}

          {isHealing && currentAction?.value && (
            <motion.div 
              initial={{ opacity: 1, y: 0, scale: 1.5 }}
              animate={{ opacity: 0, y: -30, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute text-green-400 font-black text-lg drop-shadow-[0_0_5px_rgba(0,0,0,1)] z-50 pointer-events-none"
            >
              +{currentAction.value}
            </motion.div>
          )}
          
          {data.type === 'hero' && hasBuffs && (
            <div className={`absolute -top-2 ${isEnemy ? '-left-2' : '-right-2'} bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow-md flex flex-col gap-0.5`}>
              {buffs.map((buff, i) => (
                <div key={i} className={`${isEnemy ? 'text-white' : 'text-[#66fcf1]'} drop-shadow-md whitespace-nowrap`}>{buff}</div>
              ))}
            </div>
          )}

          {data.type === 'hero' && heroState && !isDead && (
            <div className="absolute bottom-1 left-1 right-1 flex flex-col gap-0.5">
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${hpPercent}%` }}></div>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 transition-all duration-300" style={{ width: `${energyPercent}%` }}></div>
              </div>
            </div>
          )}
          
          {isDead && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl text-red-600 font-black drop-shadow-lg transform -rotate-12">X</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default function App() {
  const [mainTab, setMainTab] = useState<'formation' | 'battle'>('formation');
  const [formation, setFormation] = useState<keyof typeof formations>('fengshi');
  const [board, setBoard] = useState<(ItemData | null)[]>(Array(16).fill(null));
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'rune'>('hero');
  const [selectedHero, setSelectedHero] = useState<any | null>(null);
  
  const [enemyFormation] = useState<keyof typeof formations>('yanyue');
  const [enemyBoard, setEnemyBoard] = useState<(ItemData | null)[]>(Array(16).fill(null));

  useEffect(() => {
    const newEnemyBoard = Array(16).fill(null);
    newEnemyBoard[12] = { type: 'hero', item: heroes[1] };
    newEnemyBoard[13] = { type: 'hero', item: heroes[4] };
    newEnemyBoard[14] = { type: 'hero', item: heroes[9] };
    newEnemyBoard[15] = { type: 'hero', item: heroes[12] };
    newEnemyBoard[8] = { type: 'rune', item: runes[10] };
    newEnemyBoard[9] = { type: 'rune', item: runes[19] };
    setEnemyBoard(newEnemyBoard);
  }, []);
  
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

  const buffs = useMemo(() => calculateBuffs(board), [board]);
  const enemyBuffs = useMemo(() => calculateBuffs(enemyBoard), [enemyBoard]);

  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([]);
  const [currentBattleState, setCurrentBattleState] = useState<BattleState | undefined>(undefined);
  const [isBattling, setIsBattling] = useState(false);
  const [currentAction, setCurrentAction] = useState<BattleLog['action']>(undefined);
  const [actionMessage, setActionMessage] = useState<React.ReactNode | null>(null);
  const [battleSpeed, setBattleSpeed] = useState<number>(1);
  const battleSpeedRef = useRef(1);
  const isBattlingRef = useRef(false);

  useEffect(() => {
    battleSpeedRef.current = battleSpeed;
  }, [battleSpeed]);

  useEffect(() => {
    isBattlingRef.current = isBattling;
  }, [isBattling]);

  const startBattle = () => {
    setIsBattling(true);
    isBattlingRef.current = true;
    setBattleLogs([]);
    setCurrentBattleState(undefined);
    setCurrentAction(undefined);
    setActionMessage(null);
    
    const engine = new BattleEngine(board, enemyBoard, formation, enemyFormation, buffs, enemyBuffs);
    const logs = engine.main_loop(100);
    
    let i = 0;
    const loop = () => {
      if (i < logs.length && isBattlingRef.current) {
        setBattleLogs(prev => [...prev, logs[i]]);
        setCurrentBattleState(logs[i].state);
        setCurrentAction(logs[i].action);
        
        if (logs[i].action?.type === 'ultimate') {
          let messageContent: React.ReactNode = logs[i].action?.skillName || '必杀技';
          
          if (logs[i].action?.sourceId) {
            const [id, team, position] = logs[i].action!.sourceId!.split('_');
            const boardToUse = team === 'player' ? board : enemyBoard;
            const heroData = boardToUse[parseInt(position)]?.item;
            
            if (heroData) {
              messageContent = (
                <div className="flex items-center gap-4">
                  <div className="text-5xl bg-[#111] p-2 rounded-xl border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                    {heroData.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl text-white font-bold tracking-normal" style={{ WebkitTextStroke: '0px' }}>{heroData.name}</span>
                    <span>{logs[i].action?.skillName || '必杀技'}</span>
                  </div>
                </div>
              );
            }
          }
          
          setActionMessage(messageContent);
          setTimeout(() => setActionMessage(null), 1500 / battleSpeedRef.current);
        }
        
        i++;
        setTimeout(loop, 800 / battleSpeedRef.current);
      } else {
        setIsBattling(false);
        setCurrentAction(undefined);
      }
    };
    loop();
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#c5c6c7] font-sans flex flex-col items-center select-none">
      <div className="w-full bg-[#111] border-b border-gray-800 px-6 py-3 flex items-center justify-between shadow-md z-10">
        <div className="flex items-baseline gap-4">
          <h1 className="text-[#66fcf1] text-2xl font-bold drop-shadow-[0_0_10px_rgba(102,252,241,0.5)]">
            《河图：唐破阵志》
          </h1>
          <div className="text-[#45a29e] text-sm">
            河图演万象，玄甲破千阵
          </div>
        </div>
        <div className="flex gap-2 bg-[#1f2833] p-1 rounded-lg border border-gray-700">
          <button 
            onClick={() => setMainTab('formation')} 
            className={`px-8 py-2 rounded-md font-bold transition-all ${mainTab === 'formation' ? 'bg-[#45a29e] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            布阵
          </button>
          <button 
            onClick={() => setMainTab('battle')} 
            className={`px-8 py-2 rounded-md font-bold transition-all ${mainTab === 'battle' ? 'bg-[#45a29e] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            战斗
          </button>
        </div>
      </div>

      {mainTab === 'formation' ? (
        <div className="flex gap-5 w-full max-w-6xl items-stretch mt-6 p-5">
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
                ? heroes.map(hero => <DraggableItem key={hero.id} item={hero} type="hero" onClick={() => setSelectedHero(hero)} />)
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
                  onHeroClick={setSelectedHero}
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
      ) : (
        <div className="flex flex-col w-full max-w-6xl items-center mt-6 p-5">
          <div className="flex w-full items-center justify-center gap-10">
            {/* Left Board */}
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#66fcf1] mb-4">我方阵容</h2>
              <div className="grid grid-cols-4 grid-rows-4 gap-2 bg-[#111] p-4 rounded-xl border-2 border-[#45a29e] shadow-[0_0_30px_rgba(69,162,158,0.3)] w-[400px] h-[400px]">
                {Array.from({ length: 16 }).map((_, i) => {
                  const col = Math.floor(i / 4) + 1;
                  const row = (i % 4) + 1;
                  return <BattleSlot key={i} index={i} data={board[i]} buffs={buffs[i]} col={col} row={row} isHeroSlot={formations[formation].slots.includes(i)} battleState={currentBattleState} currentAction={currentAction} />
                })}
              </div>
            </div>
            
            {/* VS Divider */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-1 h-32 bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>
              <div className="text-4xl font-black text-red-500 my-4 italic drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">VS</div>
              <div className="w-1 h-32 bg-gradient-to-t from-transparent via-red-500 to-transparent"></div>
              
              <button 
                onClick={startBattle}
                disabled={isBattling}
                className="mt-8 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.6)] hover:bg-red-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBattling ? '战斗进行中...' : '⚔️ 开始战斗'}
              </button>
              
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 5].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setBattleSpeed(speed)}
                    className={`px-3 py-1 rounded-md font-bold text-sm transition-all ${battleSpeed === speed ? 'bg-[#66fcf1] text-black shadow-[0_0_10px_rgba(102,252,241,0.5)]' : 'bg-[#1f2833] text-gray-400 hover:text-white border border-gray-700'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Right Board (Enemy) */}
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold text-red-400 mb-4">敌方阵容</h2>
              <div className="grid grid-cols-4 grid-rows-4 gap-2 bg-[#111] p-4 rounded-xl border-2 border-red-900 shadow-[0_0_30px_rgba(153,27,27,0.3)] w-[400px] h-[400px]">
                {Array.from({ length: 16 }).map((_, i) => {
                  const col = 4 - Math.floor(i / 4);
                  const row = (i % 4) + 1;
                  return <BattleSlot key={i} index={i} data={enemyBoard[i]} buffs={enemyBuffs[i]} col={col} row={row} isHeroSlot={formations[enemyFormation].slots.includes(i)} isEnemy battleState={currentBattleState} currentAction={currentAction} />
                })}
              </div>
            </div>
          </div>
          
          {/* Action Message Overlay */}
          {actionMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1.2, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: -50 }}
              className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] italic tracking-widest" style={{ WebkitTextStroke: '2px #fff' }}>
                {actionMessage}
              </div>
            </motion.div>
          )}

          {/* Action Order Progress Bar */}
          {currentBattleState && (
            <div className="w-full max-w-4xl mt-8 bg-[#111] rounded-xl border border-gray-700 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#45a29e]/10 to-transparent pointer-events-none"></div>
              <div className="flex justify-between text-xs text-gray-500 mb-2 px-2">
                <span>起点 (行动值高)</span>
                <span className="text-[#66fcf1] font-bold">终点 (即将行动)</span>
              </div>
              <div className="relative h-12 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                {/* Track Background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDQwbDQwLTQwTTAgODBMODAgME00MCA4MGw0MC00MCIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
                
                {/* Hero Icons on Track */}
                {currentBattleState.filter(h => h.current_hp > 0).map(hero => {
                  // Calculate position: 0 current_av means they are at the end (right side, 100%)
                  // We cap the max AV to 200 for visualization purposes to spread them out
                  const maxVisualAv = 200;
                  const percent = Math.max(0, Math.min(100, 100 - (hero.current_av / maxVisualAv) * 100));
                  
                  // Find hero data to get icon
                  const boardToUse = hero.team === 'player' ? board : enemyBoard;
                  const heroData = boardToUse[hero.position]?.item;
                  
                  if (!heroData) return null;

                  return (
                    <motion.div
                      key={hero.id}
                      animate={{ left: `calc(${percent}% - 24px)` }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex flex-col items-center justify-center text-xl border-2 shadow-lg z-10 ${
                        hero.team === 'player' 
                          ? 'bg-[#1f2833] border-[#66fcf1] shadow-[0_0_10px_rgba(102,252,241,0.5)]' 
                          : 'bg-[#1f2833] border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                      }`}
                      title={`${heroData.name} (AV: ${Math.floor(hero.current_av)})`}
                    >
                      {heroData.icon}
                      <div className="absolute -bottom-4 text-[9px] font-mono bg-black/80 px-1 rounded text-gray-300 whitespace-nowrap">
                        {Math.floor(hero.current_av)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Battle Logs */}
          <div className="w-full max-w-4xl mt-10 bg-[#1f2833] rounded-xl border border-gray-700 p-4 h-[300px] flex flex-col">
            <h3 className="text-[#66fcf1] font-bold mb-3 border-b border-gray-700 pb-2">战斗日志</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 font-mono text-sm">
              {battleLogs.length === 0 ? (
                <div className="text-gray-500 italic text-center mt-10">点击“开始战斗”查看战报</div>
              ) : (
                battleLogs.map((log, i) => (
                  <div key={i} className={`py-1 ${log?.msg?.includes('阵亡') ? 'text-red-400' : log?.msg?.includes('胜利') ? 'text-yellow-400 font-bold text-base' : 'text-gray-300'}`}>
                    {log?.msg}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Info Modal */}
      {selectedHero && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm" onClick={() => setSelectedHero(null)}>
          <div className="bg-[#1f2833] border-2 border-[#f6b93b] rounded-2xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(246,185,59,0.2)] relative" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
              onClick={() => setSelectedHero(null)}
            >
              ✕
            </button>
            
            <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
              <div className="text-6xl bg-[#111] p-4 rounded-xl border border-gray-700">{selectedHero.icon}</div>
              <div>
                <h2 className="text-3xl font-black text-white mb-2">{selectedHero.name}</h2>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-bold border border-gray-700">{selectedHero.unitType}</span>
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs font-bold border border-blue-800">{selectedHero.role}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#111] p-3 rounded-lg border border-gray-800 flex flex-col items-center">
                <span className="text-gray-500 text-xs mb-1">兵力 (HP)</span>
                <span className="text-green-400 font-mono text-xl">{selectedHero.hp}</span>
              </div>
              <div className="bg-[#111] p-3 rounded-lg border border-gray-800 flex flex-col items-center">
                <span className="text-gray-500 text-xs mb-1">武力 (ATK)</span>
                <span className="text-red-400 font-mono text-xl">{selectedHero.atk}</span>
              </div>
              <div className="bg-[#111] p-3 rounded-lg border border-gray-800 flex flex-col items-center">
                <span className="text-gray-500 text-xs mb-1">谋略 (INT)</span>
                <span className="text-purple-400 font-mono text-xl">{selectedHero.int}</span>
              </div>
              <div className="bg-[#111] p-3 rounded-lg border border-gray-800 flex flex-col items-center">
                <span className="text-gray-500 text-xs mb-1">统率 (DEF)</span>
                <span className="text-blue-400 font-mono text-xl">{selectedHero.def}</span>
              </div>
              <div className="bg-[#111] p-3 rounded-lg border border-gray-800 flex flex-col items-center col-span-2">
                <span className="text-gray-500 text-xs mb-1">速度 (SPD)</span>
                <span className="text-yellow-400 font-mono text-xl">{selectedHero.spd}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#f6b93b]/20 to-transparent p-4 rounded-xl border border-[#f6b93b]/30">
              <h3 className="text-[#f6b93b] font-bold mb-2 flex items-center gap-2">
                <span className="text-lg">✨</span> 技能：{selectedHero.skillName}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedHero.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
