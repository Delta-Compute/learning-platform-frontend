export const parseFeedbackOfApp = (str: string) => {
  const satisfaction = str.match(/\*\*Satisfaction\*\*: (.+)/);
  const likedFeatures = str.match(/\*\*Liked Features\*\*: (.+)/);
  const improvements = str.match(/\*\*Improvements\*\*: (.+)/);
  const missingFeatures = str.match(/\*\*Missing Features\*\*: (.+)/);
  const recommendation = str.match(/\*\*Recommendation\*\*: (.+)/);
  

  return {
    satisfaction: satisfaction ? satisfaction[1].trim() : '',
    likedFeatures: likedFeatures ? likedFeatures[1].trim() : '',
    improvements: improvements ? improvements[1].trim() : '',
    missingFeatures: missingFeatures ? missingFeatures[1].trim() : '',
    recommendation: recommendation ? recommendation[1].trim() : '',
  };
};