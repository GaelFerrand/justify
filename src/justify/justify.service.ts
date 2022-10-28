import { Injectable } from '@nestjs/common';

const MAX_LINE_SIZE_CHARACTERS = 80;

@Injectable()
export class JustifyService {
  justify(text: string): string {
    const paragraphs = this.splitIntoParagraphs(text);

    let result = '';
    for (const paragraph of paragraphs) {
      const words = this.splitIntoWords(paragraph);

      let line = '';
      wordLoop: for (const word of words) {
        // This chunk is hard to extract in a separate function. Essentially, it will
        // split a long word into multiples lines so that it fills started lines and
        // can be filled after. Like for example:
        // "some sentence and aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        // "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        // "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa and some other words"
        if (this.wordIsLongerThanLineMaxLength(word)) {
          const firstIterationEnd = MAX_LINE_SIZE_CHARACTERS - line.length;
          const splittedWord = this.splitWord(word, firstIterationEnd);

          for (const fragment of splittedWord) {
            line = this.addWord(line, fragment);

            if (this.lineIsFull(line)) {
              result = this.addLine(result, line);
              line = '';
            } else {
              continue wordLoop;
            }
          }
        }

        if (!this.lineCanIncludeWord(line, word)) {
          result = this.addLine(result, line);
          line = '';
        }

        line = this.addWord(line, word);
      }

      result = this.addLine(result, line);
    }

    return this.removeLastLineBreak(result);
  }

  splitIntoParagraphs(text: string): string[] {
    return text.split('\n');
  }

  splitIntoWords(text: string): string[] {
    return text.split(' ');
  }

  removeLastLineBreak(text: string): string {
    const lastIndexOfLineBreak = text.lastIndexOf('\n');
    if (lastIndexOfLineBreak !== -1) return text.slice(0, lastIndexOfLineBreak);
    return text;
  }

  lineCanIncludeWord(line: string, word: string) {
    return line.length + word.length <= MAX_LINE_SIZE_CHARACTERS;
  }

  addWord(line: string, word: string): string {
    if (line.length + word.length === MAX_LINE_SIZE_CHARACTERS)
      return `${line}${word}`;
    return `${line}${word} `;
  }

  addLine(text: string, line: string): string {
    return `${text}${line.trim()}\n`;
  }

  wordIsLongerThanLineMaxLength(word: string): boolean {
    return word.length > MAX_LINE_SIZE_CHARACTERS;
  }

  splitWord(
    word: string,
    firstIterationEnd = MAX_LINE_SIZE_CHARACTERS,
  ): string[] {
    const result = [];

    while (word.length > 0) {
      const end =
        result.length === 0 ? firstIterationEnd : MAX_LINE_SIZE_CHARACTERS;
      const substr = word.slice(0, end);
      result.push(substr);
      word = word.substring(end);
    }

    return result;
  }

  lineIsFull(line: string): boolean {
    return line.length === MAX_LINE_SIZE_CHARACTERS;
  }
}
