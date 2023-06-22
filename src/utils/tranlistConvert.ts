import { invert } from './invert';

const preset = 'ru';

const englishVowels = ['a', 'e', 'i', 'o', 'u'];
const russianVowels = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'];

const firstLetters = {
  а: 'a',
  б: 'b',
  в: 'v',
  д: 'd',
  з: 'z',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'y',
  ф: 'f',
  ь: '',
  г: 'g',
  и: 'i',
  ъ: '',
  ы: 'i',
  э: 'e',
};

type TReversedLetters = { [K in (typeof firstLetters)[keyof typeof firstLetters]]: keyof typeof firstLetters };

let reversedFirstLetters: TReversedLetters;

// Russian: i > always и, y > й in initial position, e > э in initial position
reversedFirstLetters = Object.assign(invert(firstLetters), { i: 'и', '': '' });

// digraphs appearing only in initial position
const initialDigraphs = { е: 'ye' };

// sounds appearing only after vowels
const afterVowelLetters: { [key: string]: string } = { u: 'ю' };

// digraphs appearing in all positions
const regularDigraphs = {
  ё: 'yo',
  ж: 'zh',
  х: 'h',
  ц: 'ts',
  ч: '4',
  ш: 'sh',
  щ: 'shch',
  ю: 'u',
  я: 'ja',
};

const firstDigraphs = Object.assign({}, regularDigraphs, initialDigraphs);

const reversedFirstDigraphs = Object.assign(invert(firstDigraphs));

const firstAssociations = Object.assign(firstLetters, firstDigraphs);

const reversedAfterVowelLetters = Object.assign(invert(afterVowelLetters));

/*
  ASSOCIATIONS FOR NON-INITIAL POSITION
  */

const nonFirstLetters = Object.assign({}, firstLetters, { й: 'i' });
if (preset === 'ru') {
  Object.assign(nonFirstLetters, { е: 'e' });
}

let reversedNonFirstLetters: TReversedLetters;

// Russian: i > always и, y > ы in non-initial position, e > э in non-initial position
reversedNonFirstLetters = Object.assign(invert(firstLetters), {
  i: 'и',
  e: 'е',
  '': '',
});
// digraphs appearing only in non-initial positions
let nonInitialDigraphs = {};

const nonFirstDigraphs = Object.assign(regularDigraphs, nonInitialDigraphs);

const reversedNonFirstDigraphs = Object.assign(invert(nonFirstDigraphs));

export const reverse = (input: string, spaceReplacement?: string) => {
  if (!input) return '';

  const normalizedInput = input.normalize();

  let newStr = '';
  let isWordBoundary = false;
  let i = 0;

  while (i < normalizedInput.length) {
    const isUpperCaseOrWhatever = normalizedInput[i] === normalizedInput[i].toUpperCase();
    let strLowerCase = normalizedInput[i].toLowerCase();
    let currentIndex = i;
    const lastNewStrLetter = normalizedInput.slice(currentIndex - 1, currentIndex);
    const nextNewStrLetter = normalizedInput.slice(currentIndex, currentIndex + 1);

    if (strLowerCase === ' ' || strLowerCase === spaceReplacement) {
      newStr += ' ';
      isWordBoundary = true;
      i++;
      continue;
    }

    let newLetter;

    let digraph = normalizedInput.slice(i, i + 2).toLowerCase();
    if (i === 0 || isWordBoundary) {
      newLetter = reversedFirstDigraphs[digraph];
      if (newLetter) {
        i += 2;
      } else {
        newLetter = reversedFirstLetters[strLowerCase];
        i++;
      }
      isWordBoundary = false;
    } else {
      newLetter = reversedNonFirstDigraphs[digraph];
      if (newLetter) {
        i += 2;
      } else {
        newLetter = reversedNonFirstLetters[strLowerCase];
        i++;
      }
    }

    // special cases: щ and зг
    if (normalizedInput.slice(currentIndex, currentIndex + 4).toLowerCase() === 'shch') {
      newLetter = 'щ';
      i = currentIndex + 4;
    } else if (normalizedInput.slice(currentIndex - 1, currentIndex + 2).toLowerCase() === 'zgh') {
      newLetter = 'г';
      i = currentIndex + 2;
    }

    // check if letter should be changed because of vowel
    // console.log('includes:', englishVowels.includes(lastNewStrLetter.toLowerCase()));
    // console.log('next is in list:', !!afterVowelLetters[nextNewStrLetter], nextNewStrLetter);
    if (englishVowels.includes(lastNewStrLetter.toLowerCase()) && !!afterVowelLetters[nextNewStrLetter]) {
      newLetter = afterVowelLetters[nextNewStrLetter];
      i = currentIndex + 1;
    }

    if ('undefined' === typeof newLetter) {
      newStr += isUpperCaseOrWhatever ? strLowerCase.toUpperCase() : strLowerCase;
    } else {
      if (isUpperCaseOrWhatever) {
        // handle multi-symbol letters
        newLetter.length > 1 ? (newStr += newLetter[0].toUpperCase() + newLetter.slice(1)) : (newStr += newLetter.toUpperCase());
      } else {
        newStr += newLetter;
      }
    }
  }

  return newStr;
};
