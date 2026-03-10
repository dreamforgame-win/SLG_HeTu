import { heroes } from './data';

export class Hero {
  id: string;
  name: string;
  hp: number;
  atk: number;
  int: number;
  def: number;
  spd: number;
  
  current_hp: number;
  energy: number;
  base_av: number;
  current_av: number;
  position: number;
  team: 'player' | 'enemy';
  
  buffs: { type: string, duration: number, value?: any }[] = [];
  shield: number = 0;
  
  constructor(data: any, position: number, team: 'player' | 'enemy') {
    this.id = data.id + '_' + team + '_' + position;
    this.name = data.name;
    this.hp = data.hp;
    this.atk = data.atk;
    this.int = data.int;
    this.def = data.def;
    this.spd = data.spd;
    
    this.current_hp = this.hp;
    this.energy = 0;
    this.base_av = 10000 / this.spd;
    this.current_av = this.base_av;
    this.position = position;
    this.team = team;
  }

  hasBuff(type: string) {
    return this.buffs.some(b => b.type === type);
  }

  addBuff(type: string, duration: number, value?: any) {
    const existing = this.buffs.find(b => b.type === type);
    if (existing) {
      existing.duration = Math.max(existing.duration, duration);
      if (value !== undefined) existing.value = value;
    } else {
      this.buffs.push({ type, duration, value });
    }
  }

  removeBuff(type: string) {
    this.buffs = this.buffs.filter(b => b.type !== type);
  }

  tickBuffs() {
    this.buffs.forEach(b => b.duration--);
    this.buffs = this.buffs.filter(b => b.duration > 0);
  }
}

export type BattleState = {
  id: string;
  current_hp: number;
  max_hp: number;
  energy: number;
  team: 'player' | 'enemy';
  position: number;
  current_av: number;
  base_av: number;
}[];

export type BattleLog = {
  msg: string;
  state: BattleState;
  action?: {
    type: 'normal' | 'ultimate' | 'damage' | 'heal' | 'buff' | 'die';
    sourceId?: string;
    targetId?: string;
    targetIds?: string[];
    value?: number;
    skillName?: string;
  };
};

export class BattleEngine {
  heroes: Hero[] = [];
  logs: BattleLog[] = [];
  playerFormation: string;
  enemyFormation: string;
  
  formationProbabilities: Record<string, Record<number, number>> = {
    'fengshi': { 2: 0.1, 6: 0.2, 10: 0.3, 14: 0.4 },
    'sixiang': { 0: 0.25, 3: 0.25, 12: 0.25, 15: 0.25 },
    'yanyue': { 12: 0.25, 13: 0.25, 14: 0.25, 15: 0.25 },
    'gushou': { 5: 0.2, 6: 0.2, 9: 0.3, 10: 0.3 },
    'fangyuan': { 1: 0.1, 7: 0.2, 8: 0.3, 14: 0.4 }
  };

  constructor(playerBoard: any[], enemyBoard: any[], playerFormation: string, enemyFormation: string) {
    this.playerFormation = playerFormation;
    this.enemyFormation = enemyFormation;
    
    playerBoard.forEach((slot, i) => {
      if (slot && slot.type === 'hero') {
        this.heroes.push(new Hero(slot.item, i, 'player'));
      }
    });
    
    enemyBoard.forEach((slot, i) => {
      if (slot && slot.type === 'hero') {
        this.heroes.push(new Hero(slot.item, i, 'enemy'));
      }
    });
    
    this.log('战斗开始！');
  }
  
  getSnapshot(): BattleState {
    return this.heroes.map(h => ({
      id: h.id,
      current_hp: h.current_hp,
      max_hp: h.hp,
      energy: h.energy,
      team: h.team,
      position: h.position,
      current_av: h.current_av,
      base_av: h.base_av
    }));
  }

  log(msg: string, action?: BattleLog['action']) {
    this.logs.push({ msg: `[战报] ${msg}`, state: this.getSnapshot(), action });
    console.log(`[战报] ${msg}`);
  }
  
  getAliveHeroes(team?: 'player' | 'enemy') {
    return this.heroes.filter(h => h.current_hp > 0 && (!team || h.team === team));
  }
  
  isGameOver() {
    const playerAlive = this.getAliveHeroes('player').length > 0;
    const enemyAlive = this.getAliveHeroes('enemy').length > 0;
    return !playerAlive || !enemyAlive;
  }
  
  advance_time() {
    const alive = this.getAliveHeroes();
    if (alive.length === 0) return null;
    
    let min_av = Math.min(...alive.map(h => h.current_av));
    
    alive.forEach(h => {
      h.current_av -= min_av;
    });
    
    return alive.filter(h => h.current_av <= 0);
  }
  
  selectTarget(attacker: Hero, ignoreTaunt = false) {
    const targetTeam = attacker.team === 'player' ? 'enemy' : 'player';
    const enemies = this.getAliveHeroes(targetTeam);
    if (enemies.length === 0) return null;
    
    if (!ignoreTaunt) {
      const taunters = enemies.filter(e => e.hasBuff('taunt'));
      if (taunters.length > 0) {
        return taunters[Math.floor(Math.random() * taunters.length)];
      }
    }
    
    const formation = targetTeam === 'player' ? this.playerFormation : this.enemyFormation;
    const probs = this.formationProbabilities[formation] || {};
    
    let totalProb = 0;
    const enemyProbs = enemies.map(e => {
      const p = probs[e.position] || 1;
      totalProb += p;
      return { hero: e, prob: p };
    });
    
    let rand = Math.random() * totalProb;
    for (const ep of enemyProbs) {
      if (rand < ep.prob) return ep.hero;
      rand -= ep.prob;
    }
    
    return enemies[0];
  }
  
  dealDamage(attacker: Hero, target: Hero, skillMultiplier: number, isMagic: boolean, isTrueDamage = false, ignoreDefPercent = 0) {
    if (target.current_hp <= 0) return;

    let damage = 0;
    if (isTrueDamage) {
      damage = (isMagic ? attacker.int : attacker.atk) * skillMultiplier;
    } else {
      const targetDef = target.def * (1 - ignoreDefPercent);
      if (isMagic) {
        damage = (attacker.int * skillMultiplier) * (300 / (300 + target.int));
      } else {
        damage = (attacker.atk * skillMultiplier) * (300 / (300 + targetDef));
      }
    }

    if (target.hasBuff('weakness')) damage *= 1.3;
    if (target.hasBuff('protection')) damage *= 0.5;
    if (attacker.hasBuff('resonance')) damage += attacker.spd * 2;

    damage = Math.max(1, Math.floor(damage));
    
    // SoulLink
    if (target.hasBuff('soul_link')) {
      const linkedAllies = this.getAliveHeroes(target.team).filter(h => h.hasBuff('soul_link'));
      const splitDamage = Math.floor(damage / linkedAllies.length);
      linkedAllies.forEach(ally => {
        this.applyDamage(attacker, ally, splitDamage, isMagic);
      });
    } else {
      this.applyDamage(attacker, target, damage, isMagic);
    }
  }

  applyDamage(attacker: Hero, target: Hero, damage: number, isMagic: boolean) {
    if (target.shield > 0) {
      if (target.shield >= damage) {
        target.shield -= damage;
        this.log(`${attacker.name} 对 ${target.name} 造成了 ${damage} 点${isMagic ? '谋略' : '物理'}伤害 (护盾吸收)`);
        return;
      } else {
        damage -= target.shield;
        target.shield = 0;
      }
    }

    target.current_hp -= damage;
    this.log(`${attacker.name} 对 ${target.name} 造成了 ${damage} 点${isMagic ? '谋略' : '物理'}伤害 (剩余兵力: ${Math.max(0, target.current_hp)})`, {
      type: 'damage',
      sourceId: attacker.id,
      targetId: target.id,
      value: damage
    });
    
    if (target.current_hp <= 0 && target.hasBuff('death_resist')) {
      target.current_hp = 1;
      target.removeBuff('death_resist');
      this.heal(target, target, target.hp * 0.2);
      this.log(`${target.name} 触发了锁血！`);
    }

    if (target.current_hp > 0) {
      if (!target.hasBuff('energy_block')) {
        target.energy = Math.min(100, target.energy + 10);
        if (target.energy === 100) {
          this.log(`${target.name} 能量已满！`);
        }
      }
    } else {
      this.log(`${target.name} 阵亡了！`, { type: 'die', targetId: target.id });
      if (attacker.name === '关羽') {
        attacker.energy = 100;
        attacker.current_av = 0;
        this.log(`${attacker.name} 击杀目标，回满能量并立即行动！`);
      }
      if (attacker.name === '太史慈') {
        attacker.energy = Math.min(100, attacker.energy + 30);
        this.log(`${attacker.name} 击杀目标，恢复30点能量！`);
      }
    }
  }

  heal(caster: Hero, target: Hero, amount: number) {
    if (target.current_hp <= 0) return;
    amount = Math.floor(amount);
    target.current_hp = Math.min(target.hp, target.current_hp + amount);
    this.log(`${caster.name} 治疗了 ${target.name} ${amount} 点兵力 (剩余兵力: ${target.current_hp})`, {
      type: 'heal',
      sourceId: caster.id,
      targetId: target.id,
      value: amount
    });
  }
  
  normal_attack(hero: Hero) {
    const target = this.selectTarget(hero);
    if (!target) return;
    
    this.log(`${hero.name} 发动普通攻击`, {
      type: 'normal',
      sourceId: hero.id,
      targetId: target.id
    });
    this.dealDamage(hero, target, 1.0, false);
    
    const energyGain = hero.hasBuff('tianjiao') ? 30 : 20;
    if (!hero.hasBuff('energy_block')) {
      hero.energy = Math.min(100, hero.energy + energyGain);
      if (hero.energy === 100) {
        this.log(`${hero.name} 能量已满！`);
      }
    }
  }
  
  ultimate_attack(hero: Hero) {
    const skillName = heroes.find(h => h.name === hero.name)?.skillName || '必杀技';
    this.log(`${hero.name} 释放了必杀技【${skillName}】！`, {
      type: 'ultimate',
      sourceId: hero.id,
      skillName: skillName
    });
    const enemies = this.getAliveHeroes(hero.team === 'player' ? 'enemy' : 'player');
    const allies = this.getAliveHeroes(hero.team);

    switch (hero.name) {
      case '刘备':
        allies.forEach(ally => {
          ally.removeBuff('poison');
          ally.removeBuff('stun');
          ally.removeBuff('weakness');
          ally.removeBuff('def_down');
          ally.removeBuff('energy_block');
          ally.current_av = Math.max(0, ally.current_av - ally.base_av * 0.25);
          ally.addBuff('tianjiao', 2);
        });
        this.log(`${hero.name} 清除了全体友军负面状态并拉条！`);
        break;
      case '曹操':
        enemies.forEach(e => e.addBuff('taunt', 1));
        hero.addBuff('death_resist', 2);
        this.log(`${hero.name} 嘲讽了全体敌军，并获得了锁血！`);
        break;
      case '关羽':
        const lowestHpEnemy = enemies.sort((a, b) => (a.current_hp / a.hp) - (b.current_hp / b.hp))[0];
        if (lowestHpEnemy) this.dealDamage(hero, lowestHpEnemy, 2.8, false);
        break;
      case '诸葛亮':
        enemies.forEach(e => {
          this.dealDamage(hero, e, 1.0, true);
          e.addBuff('poison', 2, hero.int * 0.5);
        });
        break;
      case '赵云':
        for (let i = 0; i < 3; i++) {
          const target = this.selectTarget(hero);
          if (target) {
            this.dealDamage(hero, target, 1.2, false);
            if (Math.random() < 0.6) {
              target.addBuff('stun', 1);
              this.log(`${target.name} 被眩晕了！`);
            }
          }
        }
        break;
      case '吕布':
        const lbTarget = this.selectTarget(hero);
        if (lbTarget) {
          lbTarget.shield = 0;
          this.dealDamage(hero, lbTarget, 3.0, false);
        }
        break;
      case '孙尚香':
        const hitTargets = new Set();
        for (let i = 0; i < 3; i++) {
          const target = this.selectTarget(hero);
          if (target) {
            let mult = 1.8;
            if (hitTargets.has(target.id)) mult *= 1.2;
            this.dealDamage(hero, target, mult, false);
            hitTargets.add(target.id);
          }
        }
        break;
      case '周瑜':
        for (let i = 0; i < 2; i++) {
          const target = this.selectTarget(hero);
          if (target) {
            this.dealDamage(hero, target, 1.5, true);
            target.addBuff('def_down', 2);
          }
        }
        const lowestHpAllies = [...allies].sort((a, b) => (a.current_hp / a.hp) - (b.current_hp / b.hp)).slice(0, 2);
        lowestHpAllies.forEach(a => {
          a.shield += hero.int * 2.0;
          this.log(`${a.name} 获得了护盾！`);
        });
        break;
      case '司马懿':
        const highestAvEnemies = [...enemies].sort((a, b) => b.current_av - a.current_av).slice(0, 2);
        highestAvEnemies.forEach(e => {
          this.dealDamage(hero, e, 1.8, false);
          e.current_av += e.base_av * 0.30;
          this.log(`${e.name} 被推条了！`);
        });
        break;
      case '夏侯惇':
        const lowestHpAlly = [...allies].sort((a, b) => (a.current_hp / a.hp) - (b.current_hp / b.hp))[0];
        const highestAtkAlly = [...allies].sort((a, b) => b.atk - a.atk)[0];
        hero.addBuff('soul_link', 2);
        if (lowestHpAlly) lowestHpAlly.addBuff('soul_link', 2);
        if (highestAtkAlly) highestAtkAlly.addBuff('soul_link', 2);
        this.log(`${hero.name} 建立了灵魂链接！`);
        break;
      case '郭嘉':
        const lowestAvEnemy = [...enemies].filter(e => e.current_av > 0).sort((a, b) => a.current_av - b.current_av)[0];
        if (lowestAvEnemy) {
          lowestAvEnemy.current_av += lowestAvEnemy.base_av * 0.40;
          lowestAvEnemy.addBuff('weakness', 2);
          this.dealDamage(hero, lowestAvEnemy, 1.0, false);
          this.log(`${lowestAvEnemy.name} 被推条并附加易伤！`);
        }
        break;
      case '貂蝉':
        let totalDrain = 0;
        enemies.forEach(e => {
          this.dealDamage(hero, e, 1.2, true);
          const drain = Math.min(e.energy, 15);
          e.energy -= drain;
          totalDrain += drain;
        });
        const allyShare = Math.floor(totalDrain / allies.length);
        allies.forEach(a => {
          if (!a.hasBuff('energy_block')) {
            a.energy = Math.min(100, a.energy + allyShare);
          }
        });
        this.log(`${hero.name} 吸取了 ${totalDrain} 点能量并平分给友军！`);
        break;
      case '华佗':
        allies.forEach(a => {
          this.heal(hero, a, hero.int * 1.5);
          if (a.current_hp < a.hp * 0.3) {
            a.addBuff('protection', 1);
            this.log(`${a.name} 获得了高额免伤！`);
          }
        });
        break;
      case '左慈':
        const hitCounts: Record<string, number> = {};
        for (let i = 0; i < 4; i++) {
          const target = enemies[Math.floor(Math.random() * enemies.length)];
          if (target) {
            hitCounts[target.id] = (hitCounts[target.id] || 0) + 1;
            const mult = 2.0 * Math.pow(0.5, hitCounts[target.id] - 1);
            this.dealDamage(hero, target, mult, true);
          }
        }
        break;
      case '黄月英':
        const highestSpdAlly = [...allies].sort((a, b) => b.spd - a.spd)[0];
        const highestAtkAlly2 = [...allies].sort((a, b) => b.atk - a.atk)[0];
        if (highestSpdAlly) highestSpdAlly.addBuff('resonance', 2);
        if (highestAtkAlly2) highestAtkAlly2.addBuff('resonance', 2);
        this.log(`${hero.name} 为友军附加了真伤强化！`);
        break;
      case '张飞':
        for (let i = 0; i < 5; i++) {
          const target = enemies[Math.floor(Math.random() * enemies.length)];
          if (target) {
            this.dealDamage(hero, target, 0.8, false);
            target.spd = Math.max(1, target.spd - 10);
            hero.spd += 10;
            target.base_av = 10000 / target.spd;
            hero.base_av = 10000 / hero.spd;
            this.log(`${hero.name} 偷取了 ${target.name} 的速度！`);
          }
        }
        break;
      case '马超':
        const highestIntEnemy = [...enemies].sort((a, b) => b.int - a.int)[0];
        if (highestIntEnemy) {
          let mult = 2.5;
          if (highestIntEnemy.buffs.some(b => ['poison', 'stun', 'def_down', 'weakness', 'energy_block'].includes(b.type))) {
            mult *= 2;
          }
          this.dealDamage(hero, highestIntEnemy, mult, false, false, 0.5);
        }
        break;
      case '庞统':
        const lowestSpdAlly = [...allies].sort((a, b) => a.spd - b.spd)[0];
        if (lowestSpdAlly) {
          lowestSpdAlly.current_av = 0;
          if (!lowestSpdAlly.hasBuff('energy_block')) {
            lowestSpdAlly.energy = Math.min(100, lowestSpdAlly.energy + 50);
          }
          this.log(`${hero.name} 将 ${lowestSpdAlly.name} 拉条至回合！`);
        }
        break;
      case '贾诩':
        const highestAtkEnemy = [...enemies].sort((a, b) => b.atk - a.atk)[0];
        const highestIntEnemy2 = [...enemies].sort((a, b) => b.int - a.int)[0];
        const ptTargets = new Set([highestAtkEnemy, highestIntEnemy2].filter(Boolean));
        ptTargets.forEach(t => {
          this.dealDamage(hero, t, 1.5, true);
          t.removeBuff('tianjiao');
          t.removeBuff('death_resist');
          t.removeBuff('soul_link');
          t.removeBuff('protection');
          t.removeBuff('resonance');
          t.addBuff('energy_block', 2);
          this.log(`${t.name} 被驱散增益并封魔！`);
        });
        break;
      case '太史慈':
        const highestHpEnemy = [...enemies].sort((a, b) => b.current_hp - a.current_hp)[0];
        if (highestHpEnemy) {
          this.dealDamage(hero, highestHpEnemy, 1.8, false);
          highestHpEnemy.addBuff('def_down', 2);
        }
        break;
      default:
        const target = this.selectTarget(hero);
        if (target) {
          const isMagic = hero.int > hero.atk;
          this.dealDamage(hero, target, 2.5, isMagic);
        }
        break;
    }
  }
  
  action(hero: Hero) {
    if (hero.current_hp <= 0) return;
    
    hero.tickBuffs();

    if (hero.hasBuff('stun')) {
      this.log(`${hero.name} 处于眩晕状态，无法行动！`);
      hero.current_av = hero.base_av;
      return;
    }

    const poisonBuff = hero.buffs.find(b => b.type === 'poison');
    if (poisonBuff) {
      const dmg = Math.floor(poisonBuff.value || 0);
      hero.current_hp -= dmg;
      this.log(`${hero.name} 受到 ${dmg} 点中毒伤害 (剩余兵力: ${Math.max(0, hero.current_hp)})`);
      if (hero.current_hp <= 0) {
        this.log(`${hero.name} 毒发身亡！`);
        return;
      }
    }
    
    if (hero.energy >= 100) {
      hero.energy = 0;
      this.ultimate_attack(hero);
    } else {
      this.normal_attack(hero);
    }
    
    hero.current_av = hero.base_av;
  }
  
  main_loop(maxTurns = 100) {
    let turns = 0;
    while (!this.isGameOver() && turns < maxTurns) {
      const readyHeroes = this.advance_time();
      if (!readyHeroes) break;
      
      readyHeroes.sort((a, b) => b.spd - a.spd);
      
      for (const hero of readyHeroes) {
        if (this.isGameOver()) break;
        this.action(hero);
      }
      turns++;
    }
    
    if (this.getAliveHeroes('player').length > 0) {
      this.log('战斗结束，我方胜利！');
    } else if (this.getAliveHeroes('enemy').length > 0) {
      this.log('战斗结束，敌方胜利！');
    } else {
      this.log('战斗结束，平局！');
    }
    
    return this.logs;
  }
}
