import dictionaryRu, { Dictionary } from 'dictionary-ru';
import nspell from 'nspell';

let spell: nspell;

const ondictionary = (err: unknown, dict: Dictionary) => {
  spell = nspell(dict);
};

dictionaryRu(ondictionary);

export const spellCorrection = (text: string) => {
  const arr = text.trim().split(' ');
  const corrected = arr
    .map((word) => {
      if (!spell.correct(word)) return spell.suggest(word)[0];
      else return word;
    })
    .join(' ');
  return corrected;
};
