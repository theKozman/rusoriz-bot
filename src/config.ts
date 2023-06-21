export const config = {
  ruMaxIndex: 2, // how far down russian should be down possible languages list to be considered detected (starts from 0)
  delta: 1.5, // how different ru and ua weights should be to be considered detected
  precisionPercent: 90, // how precise guess should be to pass
  minScore: 500, // lowest guess score to pass
};
