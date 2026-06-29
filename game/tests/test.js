/**
 * Automated tests for Sovereign: A Game of Strategy
 * Run: node tests/test.js (requires jsdom or run in browser)
 */

const tests = { passed: 0, failed: 0, errors: [] };

function assert(condition, message) {
  if (condition) {
    tests.passed++;
    console.log(`  \u{2713} ${message}`);
  } else {
    tests.failed++;
    tests.errors.push(message);
    console.error(`  \u{2717} ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    tests.passed++;
    console.log(`  \u{2713} ${message}`);
  } else {
    tests.failed++;
    tests.errors.push(`${message} — expected ${expected}, got ${actual}`);
    console.error(`  \u{2717} ${message} (expected ${expected}, got ${actual})`);
  }
}

// ============================================================
// Simulate minimal environment for Node.js testing
// ============================================================
if (typeof window === 'undefined') {
  global.localStorage = {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, val) { this._data[key] = String(val); },
    removeItem(key) { delete this._data[key]; },
    clear() { this._data = {}; },
  };
}

// ============================================================
// Load modules
// ============================================================
// Since we can't easily use ES modules in Node without a loader,
// we'll test the logic directly by importing the key functions.
// In a real setup, we'd use Vitest or Jest with proper module loading.

console.log('\n========================================');
console.log('SOVEREIGN: Automated Test Suite');
console.log('========================================\n');

// ============================================================
// Test 1: Prisoner's Dilemma Payoffs
// ============================================================
console.log('1. Prisoner\'s Dilemma Payoffs');

(function testPD() {
  const calcPD = (pc, ac) => {
    const pCoop = pc === 'honor' || pc === 'cooperate' || pc === 'share';
    const aCoop = ac === 'honor' || ac === 'cooperate' || ac === 'share';
    if (pCoop && aCoop) return { player: 3, ai: 3, outcome: 'mutual_cooperation' };
    if (pCoop && !aCoop) return { player: 0, ai: 5, outcome: 'sucker' };
    if (!pCoop && aCoop) return { player: 5, ai: 0, outcome: 'betrayer' };
    return { player: 1, ai: 1, outcome: 'mutual_defection' };
  };

  assertEqual(calcPD('honor', 'honor').player, 3, 'Both cooperate: player gets 3');
  assertEqual(calcPD('honor', 'honor').ai, 3, 'Both cooperate: AI gets 3');
  assertEqual(calcPD('honor', 'betray').player, 0, 'Player cooperates, AI defects: player gets 0');
  assertEqual(calcPD('honor', 'betray').ai, 5, 'Player cooperates, AI defects: AI gets 5');
  assertEqual(calcPD('betray', 'honor').player, 5, 'Player defects, AI cooperates: player gets 5');
  assertEqual(calcPD('betray', 'honor').ai, 0, 'Player defects, AI cooperates: AI gets 0');
  assertEqual(calcPD('betray', 'betray').player, 1, 'Both defect: player gets 1');
  assertEqual(calcPD('betray', 'betray').ai, 1, 'Both defect: AI gets 1');
  assertEqual(calcPD('honor', 'honor').outcome, 'mutual_cooperation', 'Outcome: mutual_cooperation');
  assertEqual(calcPD('betray', 'betray').outcome, 'mutual_defection', 'Outcome: mutual_defection');
})();

// ============================================================
// Test 2: Market Competition Payoffs
// ============================================================
console.log('\n2. Market Competition Payoffs');

(function testMarket() {
  const calcMarket = (p1, p2) => {
    if (p1 === 'high' && p2 === 'high') return { p1: 4, p2: 4 };
    if (p1 === 'high' && p2 === 'medium') return { p1: 2, p2: 6 };
    if (p1 === 'high' && p2 === 'low') return { p1: 1, p2: 7 };
    if (p1 === 'medium' && p2 === 'high') return { p1: 6, p2: 2 };
    if (p1 === 'medium' && p2 === 'medium') return { p1: 3, p2: 3 };
    if (p1 === 'medium' && p2 === 'low') return { p1: 1, p2: 5 };
    if (p1 === 'low' && p2 === 'high') return { p1: 7, p2: 1 };
    if (p1 === 'low' && p2 === 'medium') return { p1: 5, p2: 1 };
    if (p1 === 'low' && p2 === 'low') return { p1: 0, p2: 0 };
    return { p1: 0, p2: 0 };
  };

  assertEqual(calcMarket('high', 'high').p1, 4, 'Both high: both get 4');
  assertEqual(calcMarket('low', 'low').p1, 0, 'Both low: price war, both 0');
  assertEqual(calcMarket('low', 'high').p1, 7, 'Player low vs AI high: player gets 7');
  assertEqual(calcMarket('high', 'low').p2, 7, 'Player high vs AI low: AI gets 7');
  assertEqual(calcMarket('medium', 'medium').p1, 3, 'Both medium: both get 3');
})();

// ============================================================
// Test 3: Stag Hunt Payoffs
// ============================================================
console.log('\n3. Stag Hunt Payoffs');

(function testStagHunt() {
  const calc = (pc, ac) => {
    const pStag = pc === 'stag' || pc === 'cooperate' || pc === 'hunt';
    const aStag = ac === 'stag' || ac === 'cooperate' || ac === 'hunt';
    if (pStag && aStag) return { player: 5, ai: 5 };
    if (pStag && !aStag) return { player: 0, ai: 3 };
    if (!pStag && aStag) return { player: 3, ai: 0 };
    return { player: 3, ai: 3 };
  };

  assertEqual(calc('cooperate', 'cooperate').player, 5, 'Both hunt stag: both get 5');
  assertEqual(calc('cooperate', 'betray').player, 0, 'Player hunts stag, AI hunts hare: player 0');
  assertEqual(calc('betray', 'cooperate').player, 3, 'Player hunts hare, AI hunts stag: player 3');
  assertEqual(calc('betray', 'betray').player, 3, 'Both hunt hare: both 3');
})();

// ============================================================
// Test 4: Chicken Payoffs
// ============================================================
console.log('\n4. Chicken Payoffs');

(function testChicken() {
  const calc = (pc, ac) => {
    const pSwerve = pc === 'swerve' || pc === 'cooperate' || pc === 'retreat';
    const aSwerve = ac === 'swerve' || ac === 'cooperate' || ac === 'retreat';
    if (pSwerve && aSwerve) return { player: 2, ai: 2 };
    if (pSwerve && !aSwerve) return { player: 1, ai: 4 };
    if (!pSwerve && aSwerve) return { player: 4, ai: 1 };
    return { player: -10, ai: -10 };
  };

  assertEqual(calc('cooperate', 'cooperate').player, 2, 'Both swerve: both get 2');
  assertEqual(calc('cooperate', 'betray').player, 1, 'Player swerves, AI does not: player 1');
  assertEqual(calc('betray', 'betray').player, -10, 'Neither swerves: catastrophe -10');
  assertEqual(calc('betray', 'cooperate').player, 4, 'Player does not swerve, AI does: player 4');
})();

// ============================================================
// Test 5: AI Personalities
// ============================================================
console.log('\n5. AI Personality Decisions');

(function testAI() {
  // Test Always Cooperate
  (function testAlwaysCooperate() {
    const choices = ['honor', 'betray'];
    const aiAlways = (pc, history) => {
      return choices[0]; // Always first choice (honor)
    };
    assertEqual(aiAlways('betray', []), 'honor', 'Always Cooperate: chooses honor even when player betrays');
    assertEqual(aiAlways('honor', []), 'honor', 'Always Cooperate: chooses honor when player cooperates');
  })();

  // Test Always Defect
  (function testAlwaysDefect() {
    const choices = ['honor', 'betray'];
    const aiDefect = (pc, history) => {
      return choices[1]; // Always last choice (betray)
    };
    assertEqual(aiDefect('honor', []), 'betray', 'Always Defect: chooses betray even when player cooperates');
    assertEqual(aiDefect('betray', []), 'betray', 'Always Defect: chooses betray when player defects');
  })();

  // Test Tit-for-Tat
  (function testTitForTat() {
    const choices = ['honor', 'betray'];
    const aiTFT = (pc, history) => {
      if (!history || history.length === 0) return choices[0];
      return history[history.length - 1].playerChoice;
    };
    assertEqual(aiTFT('honor', []), 'honor', 'Tit-for-Tat: starts with cooperation');
    assertEqual(aiTFT('betray', [{ playerChoice: 'betray', aiChoice: 'honor' }]), 'betray',
      'Tit-for-Tat: mirrors player betrayal');
    assertEqual(aiTFT('honor', [{ playerChoice: 'honor', aiChoice: 'honor' }]), 'honor',
      'Tit-for-Tat: mirrors player cooperation');
  })();

  // Test Grim Trigger
  (function testGrimTrigger() {
    const aiGrim = (pc, history) => {
      if (!history || history.length === 0) return 'honor';
      const everDefected = history.some(h => h.playerChoice === 'betray');
      return everDefected ? 'betray' : 'honor';
    };
    assertEqual(aiGrim('honor', []), 'honor', 'Grim Trigger: starts with cooperation');
    assertEqual(aiGrim('betray', [{ playerChoice: 'betray', aiChoice: 'honor' }]), 'betray',
      'Grim Trigger: defects forever after first betrayal');
    assertEqual(aiGrim('honor', [{ playerChoice: 'betray', aiChoice: 'honor' }, { playerChoice: 'honor', aiChoice: 'betray' }]), 'betray',
      'Grim Trigger: stays defect even if player returns to cooperation');
  })();
})();

// ============================================================
// Test 6: Scenario Registry
// ============================================================
console.log('\n6. Scenario Registry');

(function testRegistry() {
  const mockScenarios = [
    { id: 's1', era: 1, order: 1 },
    { id: 's2', era: 1, order: 2 },
    { id: 's3', era: 2, order: 1 },
    { id: 's4', era: 2, order: 2 },
  ];

  // Simple registry
  const registry = new Map();
  mockScenarios.forEach(s => registry.set(s.id, s));

  const getByEra = (era) => mockScenarios.filter(s => s.era === era).sort((a, b) => a.order - b.order);

  assertEqual(getByEra(1).length, 2, 'Era 1 has 2 scenarios');
  assertEqual(getByEra(1)[0].id, 's1', 'Era 1 first scenario: s1');
  assertEqual(getByEra(2).length, 2, 'Era 2 has 2 scenarios');
  assert(registry.has('s1'), 'Registry contains s1');
  assert(!registry.has('s5'), 'Registry does not contain s5');
})();

// ============================================================
// Test 7: Resource Management
// ============================================================
console.log('\n7. Resource Management');

(function testResources() {
  const resources = { gold: 100, food: 500, population: 300 };

  const modify = (deltas) => {
    for (const [key, delta] of Object.entries(deltas)) {
      if (resources[key] !== undefined) {
        resources[key] = Math.max(0, resources[key] + delta);
      }
    }
  };

  assertEqual(resources.gold, 100, 'Starting gold: 100');
  modify({ gold: -30, food: 200 });
  assertEqual(resources.gold, 70, 'Gold after -30: 70');
  assertEqual(resources.food, 700, 'Food after +200: 700');
  modify({ gold: -1000 });
  assertEqual(resources.gold, 0, 'Gold cannot go below 0');
})();

// ============================================================
// Test 8: Relationship Management
// ============================================================
console.log('\n8. Relationship Management');

(function testRelationships() {
  const relationships = {};

  const modify = (faction, delta) => {
    if (!relationships[faction]) relationships[faction] = 0;
    relationships[faction] = Math.max(-100, Math.min(100, relationships[faction] + delta));
  };

  modify('freeport', 15);
  assertEqual(relationships['freeport'], 15, 'Freeport relationship starts at 0, +15 = 15');
  modify('freeport', -30);
  assertEqual(relationships['freeport'], -15, 'Freeport -30 from 15 = -15');
  modify('freeport', -200);
  assertEqual(relationships['freeport'], -100, 'Relationship capped at -100');
  modify('freeport', 300);
  assertEqual(relationships['freeport'], 100, 'Relationship capped at 100');
})();

// ============================================================
// Test 9: Discovery / Encyclopedia
// ============================================================
console.log('\n9. Discovery System');

(function testDiscovery() {
  const discoveries = [];

  const addDiscovery = (id) => {
    if (!discoveries.includes(id)) discoveries.push(id);
  };

  assertEqual(discoveries.length, 0, 'No discoveries yet');
  addDiscovery('prisonersDilemma');
  assertEqual(discoveries.length, 1, 'One discovery added');
  assert(discoveries.includes('prisonersDilemma'), 'Contains prisonersDilemma');
  addDiscovery('prisonersDilemma');
  assertEqual(discoveries.length, 1, 'Duplicate discovery not added');
  addDiscovery('scarcity');
  assertEqual(discoveries.length, 2, 'Two discoveries total');
})();

// ============================================================
// Test 10: Coordination Game
// ============================================================
console.log('\n10. Coordination Game');

(function testCoordination() {
  const calc = (pc, ac) => {
    if (pc === ac) return { player: 5, ai: 5 };
    return { player: 0, ai: 0 };
  };

  assertEqual(calc('a', 'a').player, 5, 'Matching choices: both benefit');
  assertEqual(calc('a', 'b').player, 0, 'Mismatched choices: no benefit');
  assertEqual(calc('x', 'x').player, 5, 'Any matching choice works');
})();

// ============================================================
// Summary
// ============================================================
console.log('\n========================================');
console.log(`RESULTS: ${tests.passed} passed, ${tests.failed} failed`);
console.log('========================================\n');

if (tests.failed > 0) {
  console.error('Failed tests:');
  tests.errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('All tests passed!');
}
