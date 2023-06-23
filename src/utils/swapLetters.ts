export const swapEnglishToRussian = (message: string) => {
  const englishLetters: { [key: string]: string } = {
    a: 'а',
    c: 'с',
    e: 'е',
    o: 'о',
    p: 'р',
    x: 'х',
    y: 'у',
    // Add more mappings as needed
  };

  const swappedMessage = message.replace(/([aceopxy])+/gi, (match: string) => {
    const lowerCaseMatch = match.toLowerCase();
    return englishLetters[lowerCaseMatch] || match;
  });

  return swappedMessage;
};