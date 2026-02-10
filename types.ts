
export interface NutritionData {
  name: string;
  scientificName: string;
  description: string;
  calories: number;
  macros: {
    carbohydrates: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  vitamins: {
    name: string;
    amount: string;
    percentageDV: number;
  }[];
  minerals: {
    name: string;
    amount: string;
    percentageDV: number;
  }[];
  healthBenefits: string[];
  cookingTips: string[];
  seasonality: string;
}

export interface VegetableState {
  data: NutritionData | null;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}
