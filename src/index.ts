import 'dotenv/config';
import { mastra } from './mastra/index.ts';

async function main() {
  console.log('====================================================');
  console.log('🚀 Deep Research Autonomous Agent Loop (Mastra & LiteLLM)');
  console.log('====================================================\n');

  const workflow = mastra.getWorkflow('deepResearchWorkflow');

  const query = "What is the future of software jobs and how AI is impacting the industry?";

  console.log(`📌 User Query: "${query}"`);

  try {
    const run = await workflow.createRun();
    const result = await run.start({
      inputData: { query },
    });

    console.log('\n====================================================');
    console.log('📄 FINAL PROFESSOR-GRADE DEEP RESEARCH REPORT');
    console.log('====================================================\n');
    if (result.status === 'success' && result.result) {
      console.log(result.result.finalReport);
    } else {
      console.log('Workflow status:', result.status, result);
    }
    console.log('\n====================================================');
  } catch (error) {
    console.error('❌ Workflow execution error:', error);
  }
}

main();
