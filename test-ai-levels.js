/**
 * Quick test to validate AI difficulty levels are working
 */

const { getAIManager } = require('./app/ai/AIManager.ts');

async function testAIDifficultyLevels() {
  console.log('🧪 Testing AI Difficulty Levels...\n');

  const emptyBoard = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  
  for (const difficulty of difficulties) {
    try {
      console.log(`📊 Testing ${difficulty.toUpperCase()} difficulty:`);
      
      const aiManager = getAIManager({ difficulty, showThinking: false, adaptiveTime: false });
      const start = Date.now();
      
      const result = await aiManager.getBestMove(emptyBoard);
      const duration = Date.now() - start;
      
      console.log(`  ✅ Move: Column ${result.column}, Evaluation: ${result.evaluation}, Depth: ${result.depth}`);
      console.log(`  ⏱️  Time: ${duration}ms`);
      console.log(`  📈 Difficulty info:`, aiManager.getAIInfo());
      console.log('');
      
    } catch (error) {
      console.log(`  ❌ Error testing ${difficulty}:`, error.message);
      console.log('');
    }
  }

  console.log('🎯 AI Testing Complete!');
  console.log('\n✨ Expected behavior:');
  console.log('  - Easy: Should make some suboptimal moves, faster execution');
  console.log('  - Medium: Balanced play with moderate thinking time');
  console.log('  - Hard: Strong tactical play with deeper analysis');
  console.log('  - Expert: Near-perfect play with longest thinking time');
}

// Only run if this script is executed directly
if (require.main === module) {
  testAIDifficultyLevels().catch(console.error);
}

module.exports = { testAIDifficultyLevels };