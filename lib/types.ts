export interface LifestyleInput {
  study: number;
  extra: number;
  sleep: number;
  social: number;
  physical: number;
  gpa: number;
}

export interface PredictionResponse {
  stress_level: "Low" | "Moderate" | "High";
  probabilities: {
    Low: number;
    Moderate: number;
    High: number;
  };
  confidence: number;
  top_feature: string;
}
