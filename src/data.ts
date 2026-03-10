export const heroes = [
  { id: 'h1', name: '刘备', desc: '全体友军，拉条25%，受击回能增加。', icon: '👑', unitType: '步兵', role: '辅助', hp: 2200, atk: 100, int: 180, def: 150, spd: 110, skillName: '仁德载世' },
  { id: 'h2', name: '曹操', desc: '嘲讽全体敌军1回合，锁血20%。', icon: '🗡️', unitType: '骑兵', role: '统帅', hp: 2800, atk: 150, int: 200, def: 200, spd: 105, skillName: '乱世奸雄' },
  { id: 'h3', name: '关羽', desc: '斩杀敌方血量最低，击杀后立即行动。', icon: '🐉', unitType: '骑兵', role: '勇武', hp: 2400, atk: 260, int: 120, def: 160, spd: 115, skillName: '武圣降临' },
  { id: 'h4', name: '诸葛亮', desc: '全体敌军，附加回合开始时真实伤害。', icon: '🪭', unitType: '弓兵', role: '奇谋', hp: 1600, atk: 60, int: 280, def: 120, spd: 100, skillName: '卧龙借东风' },
  { id: 'h5', name: '赵云', desc: '随机攻击敌方3个目标，60%眩晕。', icon: '🐉', unitType: '骑兵', role: '突袭', hp: 2100, atk: 240, int: 140, def: 140, spd: 130, skillName: '七进七出' },
  { id: 'h6', name: '吕布', desc: '单体攻击敌方1人，强制破盾并造成巨额伤害。', icon: '🔱', unitType: '骑兵', role: '勇武', hp: 2600, atk: 300, int: 40, def: 150, spd: 125, skillName: '无双乱舞' },
  { id: 'h7', name: '孙尚香', desc: '随机攻击敌方3次，重复攻击同一人伤害增加。', icon: '🏹', unitType: '弓兵', role: '突袭', hp: 1700, atk: 220, int: 100, def: 110, spd: 135, skillName: '枭姬连环弩' },
  { id: 'h8', name: '周瑜', desc: '攻击2个随机敌军，为我方血量最低的2人加盾。', icon: '🔥', unitType: '弓兵', role: '统帅', hp: 1800, atk: 80, int: 250, def: 130, spd: 108, skillName: '火烧连营' },
  { id: 'h9', name: '司马懿', desc: '攻击敌方行动值(AV)最高的2人，强制推条。', icon: '🐺', unitType: '弓兵', role: '奇谋', hp: 1700, atk: 70, int: 260, def: 140, spd: 102, skillName: '狼顾之相' },
  { id: 'h10', name: '夏侯惇', desc: '自身与【血量最低】和【攻击最高】的友军灵魂平摊伤害。', icon: '👁️', unitType: '骑兵', role: '陷阵', hp: 2900, atk: 180, int: 80, def: 220, spd: 95, skillName: '刚烈拔矢' },
  { id: 'h11', name: '郭嘉', desc: '攻击即将行动的敌人(AV最低)，使其受到的伤害增加40%。', icon: '❄️', unitType: '弓兵', role: '奇谋', hp: 1500, atk: 50, int: 270, def: 110, spd: 112, skillName: '遗计定辽东' },
  { id: 'h12', name: '貂蝉', desc: '全体伤害，吸取全体敌军能量平均分给友军。', icon: '🌸', unitType: '步兵', role: '辅助', hp: 1500, atk: 80, int: 190, def: 100, spd: 122, skillName: '闭月羞花' },
  { id: 'h13', name: '华佗', desc: '全体回血，血量低于30%附加高额减伤。', icon: '🌿', unitType: '步兵', role: '辅助', hp: 1900, atk: 40, int: 220, def: 140, spd: 105, skillName: '青囊济世' },
  { id: 'h14', name: '左慈', desc: '随机攻击4次，陨石对同一目标伤害衰减。', icon: '✨', unitType: '弓兵', role: '奇谋', hp: 1600, atk: 60, int: 260, def: 120, spd: 115, skillName: '遁甲天书' },
  { id: 'h15', name: '黄月英', desc: '为【速度最高】和【攻击最高】的友军附加真实伤害。', icon: '⚙️', unitType: '弓兵', role: '辅助', hp: 1700, atk: 70, int: 230, def: 140, spd: 98, skillName: '机巧木牛' },
  { id: 'h16', name: '张飞', desc: '随机攻击敌方5次，每次偷取10点速度。', icon: '🐍', unitType: '骑兵', role: '勇武', hp: 2700, atk: 250, int: 50, def: 170, spd: 118, skillName: '燕人咆哮' },
  { id: 'h17', name: '马超', desc: '攻击敌方【谋略最高】者，无视50%防御，有debuff伤害翻倍。', icon: '🐎', unitType: '骑兵', role: '突袭', hp: 2300, atk: 255, int: 90, def: 130, spd: 132, skillName: '锦马寒枪' },
  { id: 'h18', name: '庞统', desc: '将我方【速度最低】的队友强制拉条到当前回合。', icon: '⛓️', unitType: '弓兵', role: '奇谋', hp: 1600, atk: 65, int: 255, def: 125, spd: 104, skillName: '连环计' },
  { id: 'h19', name: '贾诩', desc: '攻击敌方【攻击最高】和【谋略最高】者，驱散增益并禁魔。', icon: '🦂', unitType: '弓兵', role: '奇谋', hp: 1600, atk: 65, int: 255, def: 125, spd: 104, skillName: '毒士奇谋' },
  { id: 'h20', name: '太史慈', desc: '攻击全体敌军【HP最高】的敌人，附加破甲。', icon: '🏹', unitType: '弓兵', role: '勇武', hp: 2100, atk: 235, int: 110, def: 150, spd: 120, skillName: '破阵先锋' }
];

export const runes = [
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
  { id: 'r11', name: '坚盾符', desc: '最近步兵 +防御', icon: '🛡️', effect: { type: 'unit', targetUnit: '步兵', targetCount: 1, buff: '+防御' } },
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

export const formations = {
  'fengshi': { name: '🗡️ 锋矢阵 (中路贯穿)', slots: [2, 6, 10, 14] },
  'sixiang': { name: '🛡️ 四象阵 (四角分散)', slots: [0, 3, 12, 15] },
  'yanyue': { name: '🌙 偃月阵 (前排铁壁)', slots: [12, 13, 14, 15] },
  'gushou': { name: '🏰 固守阵 (中心防御)', slots: [5, 6, 9, 10] },
  'fangyuan': { name: '⭕ 方圆阵 (环形包围)', slots: [1, 7, 8, 14] }
};
