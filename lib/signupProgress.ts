import { TokenManager } from './tokenManager';
import { checkSignupStatus } from './api';

export interface SignupStatus {
  currentStep: number;
  isComplete: boolean;
}

export class SignupProgressManager {
  /**
   * Check user's signup status from server and local storage
   */
  static async checkSignupStatus(): Promise<SignupStatus> {
    try {
      // Check if user has tokens (indicating they've started signup)
      const hasTokens = TokenManager.isAuthenticated();
      
      if (hasTokens) {
        // Try to get status from server
        const statusResponse = await checkSignupStatus();
        
        if (statusResponse?.statusCode === 200 && statusResponse?.data) {
          const { currentStep, isComplete } = statusResponse.data;
          return { currentStep: currentStep || 1, isComplete: isComplete || false };
        }
      }
      
      // Fallback to local storage
      const localProgress = TokenManager.getSignupProgress();
      if (localProgress) {
        return {
          currentStep: localProgress.currentStep,
          isComplete: localProgress.isComplete
        };
      }
      
      // Default: not started
      return { currentStep: 1, isComplete: false };
    } catch (error) {
      console.error("Error checking signup status:", error);
      
      // Fallback to local storage on error
      const localProgress = TokenManager.getSignupProgress();
      if (localProgress) {
        return {
          currentStep: localProgress.currentStep,
          isComplete: localProgress.isComplete
        };
      }
      
      return { currentStep: 1, isComplete: false };
    }
  }

  /**
   * Update progress after completing a step
   */
  static updateProgress(step: number, isComplete: boolean = false): void {
    TokenManager.updateSignupProgress(step, isComplete);
  }

  /**
   * Get the next step number
   */
  static getNextStep(currentStep: number): number {
    return Math.min(currentStep + 1, 3);
  }

  /**
   * Check if user can proceed to a specific step
   */
  static canProceedToStep(targetStep: number, completedSteps: number[]): boolean {
    // User can proceed to step 1 anytime
    if (targetStep === 1) return true;
    
    // For other steps, check if previous steps are completed
    for (let i = 1; i < targetStep; i++) {
      if (!completedSteps.includes(i)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Clear all signup progress (useful for testing or reset)
   */
  static clearProgress(): void {
    TokenManager.removeSignupProgress();
  }
} 