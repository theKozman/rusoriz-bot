import { swapSymbols } from '../constants';

export const swapLetters = (message: string) => {
  const englishLetters: { [key: string]: string } = {
    a: 'а',
    c: 'с',
    e: 'е',
    o: 'о',
    p: 'р',
    x: 'х',
    y: 'у',
    τ: 'т',
    ρ: 'р',
    α: 'а',
    ο: 'о',

    // Add more mappings as needed
  };

  const swappedMessage = message.replace(swapSymbols, (match: string) => {
    const lowerCaseMatch = match.toLowerCase();

    return lowerCaseMatch
      .split('')
      .map((l) => englishLetters[l] || match)
      .join('');
  });

  return swappedMessage;
};
('Москва за 3 дня');
