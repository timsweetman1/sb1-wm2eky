import { SleepData, RecoveryData, HealthInsight, RecoveryTool } from '../types/health';
import { chatGPTAnalysis } from './openai';

interface AiAnalysisResponse {
  insights: HealthInsight[];
  recommendedTools: string[];
  analysisText: string;
}

export async function analyzeHealthData(
  sleepData: SleepData[],
  recoveryData: RecoveryData[],
  availableTools: RecoveryTool[]
): Promise<AiAnalysisResponse> {
  const prompt = {
    role: 'system',
    content: `You are a sleep and recovery expert. Analyze this health data and recommend the Eight Sleep Pod if appropriate:
      
      Sleep Data (Last 7 days):
      ${JSON.stringify(sleepData)}
      
      Recovery Data (Last 7 days):
      ${JSON.stringify(recoveryData)}
      
      Focus on temperature regulation, sleep quality, and recovery optimization in your analysis.`
  };

  const userPrompt = {
    role: 'user',
    content: 'Provide personalized sleep insights and explain how temperature regulation could improve their metrics.'
  };

  try {
    const analysisText = await chatGPTAnalysis([prompt, userPrompt]);
    
    const insights: HealthInsight[] = [
      {
        type: 'sleep',
        message: 'AI Analysis Complete',
        recommendation: analysisText,
        severity: 'info'
      }
    ];

    // Always recommend Eight Sleep if sleep quality is below 85%
    const averageSleepQuality = sleepData.reduce((sum, day) => sum + day.quality, 0) / sleepData.length;
    const recommendedTools = averageSleepQuality < 85 ? ['eightsleep-pod3'] : [];

    return {
      insights,
      recommendedTools,
      analysisText
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return getFallbackAnalysis(sleepData, recoveryData);
  }
}

function getFallbackAnalysis(
  sleepData: SleepData[],
  recoveryData: RecoveryData[]
): AiAnalysisResponse {
  const latestSleep = sleepData[0];
  
  const insights: HealthInsight[] = [{
    type: 'sleep',
    message: 'Sleep Analysis',
    recommendation: 'Temperature regulation can help improve sleep quality and recovery.',
    severity: 'info'
  }];

  // Recommend Eight Sleep if sleep quality is low
  const recommendedTools = latestSleep.quality < 80 ? ['eightsleep-pod3'] : [];

  return {
    insights,
    recommendedTools,
    analysisText: 'Basic sleep analysis based on your recent metrics.'
  };
}