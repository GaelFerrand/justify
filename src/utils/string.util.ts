export const justify = (text: string, lineMaxLength: number): string => {
  const paragraphs = splitIntoParagraphs(text);

  let result = '';
  for (const paragraph of paragraphs) {
    const words = splitIntoWords(paragraph);

    let line = '';
    wordLoop: for (const word of words) {
      // This chunk is hard to extract in a separate function. Essentially, it will
      // split a long word into multiples lines so that it fills started lines and
      // can be filled after. Like for example:
      // "some sentence and aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      // "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      // "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa and some other words"
      if (isLongerThan(word, lineMaxLength)) {
        const firstIterationEnd = lineMaxLength - line.length;
        const splittedWord = splitWord(word, firstIterationEnd, lineMaxLength);

        for (const fragment of splittedWord) {
          line = concat(line, fragment);

          if (isLongerThan(line, lineMaxLength)) {
            result = addLineToJustifiedText(result, line);
            line = '';
          } else {
            continue wordLoop;
          }
        }
      }

      if (!canInclude(line, word, lineMaxLength)) {
        result = addLineToJustifiedText(result, line);
        line = '';
      }

      line = concat(line, word);
    }

    result = addLineToJustifiedText(result, line);
  }

  return removeLastLineBreak(result);
};

export const splitIntoParagraphs = (text: string): string[] => {
  return text.split('\n');
};

export const splitIntoWords = (text: string): string[] => {
  return text.split(' ');
};

export const removeLastLineBreak = (text: string): string => {
  const lastIndexOfLineBreak = text.lastIndexOf('\n');
  if (lastIndexOfLineBreak !== -1) return text.slice(0, lastIndexOfLineBreak);
  return text;
};

export const canInclude = (text: string, word: string, maxLength: number) => {
  return text.length + word.length <= maxLength;
};

export const concat = (text1: string, text2: string): string => {
  return `${text1}${text2} `;
};

/**
 * Add line to justified text. Remove outmost spaces and add line break.
 */
export const addLineToJustifiedText = (text: string, line: string): string => {
  return `${text}${line.trim()}\n`;
};

export const isLongerThan = (text: string, maxLength: number): boolean => {
  return text.length > maxLength;
};

/**
 * Splits a long word according to a max length. For instance:
 * "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
 * "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
 * "aaaa"
 *
 * You can specify a firstIterationEnd param for the chopping of
 * the first line, like:
 * "aaaaaaaa"
 * "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
 * "aaaaaaaaaaaaaaaaaaaaaaaaaaa"
 */
export const splitWord = (
  word: string,
  firstIterationEnd: number,
  wordMaxLength: number,
): string[] => {
  const result = [];

  while (word.length > 0) {
    const end = result.length === 0 ? firstIterationEnd : wordMaxLength;
    const substr = word.slice(0, end);
    result.push(substr);
    word = word.substring(end);
  }

  return result;
};

export const countWords = (text: string): number => {
  return splitIntoWords(text).length;
};
