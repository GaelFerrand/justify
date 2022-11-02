import {
  WORD_WITH_81_CHARACTERS,
  WORD_WITH_81_CHARACTERS_SPLITTED,
  WORD_WITH_161_CHARACTERS,
  WORD_WITH_161_CHARACTERS_SPLITTED,
  WORD_WITH_161_CHARACTERS_SPLITTED_FIRST_ITERATION_47,
  LONG_TEXT_WITH_LONG_WORD,
  LONG_TEXT_WITH_LONG_WORD_AND_MORE_TEXT,
  LONG_TEXT_WITH_LONG_WORD_AND_MORE_TEXT_JUSTIFIED,
  LONG_TEXT_WITH_LONG_WORD_JUSTIFIED,
  TEXT_MULTIPLE_LINES_UNDER_80_CHARACTERS,
  TEXT_WITH_80_CHARACTERS,
  TEXT_WITH_81_CHARACTERS,
  TEXT_WITH_81_CHARACTERS_JUSTIFIED,
  TEXT_WITH_EMPTY_FIRST_LINE,
  TEXT_WITH_EMPTY_FIRST_LINE_JUSTIFIED,
  TEXT_WITH_LESS_THAN_80_CHARACTERS,
  TEXT_WITH_ONE_PARAGRAPH,
  TEXT_WITH_ONE_PARAGRAPH_JUSTIFIED,
  TEXT_WITH_TWO_PARAGRAPHS,
  TEXT_WITH_TWO_PARAGRAPHS_JUSTIFIED,
} from './string.util.mocks';
import { justify, splitWord } from './string.util';

const MAX_LENGTH = 80;

describe('StringUtil', () => {
  describe('justify()', () => {
    it('feeding an empty string > should return an empty string', () => {
      // Given
      const input = '';

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe('');
    });

    it('feeding a single word > should return said word', () => {
      // Given
      const input = 'test';

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(input);
    });

    it('feeding a sentence with less than 80 characters > should return sentence', () => {
      // Given
      const input = TEXT_WITH_LESS_THAN_80_CHARACTERS;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(input);
    });

    it('feeding a sentence with exactly 80 characters > should return sentence', () => {
      // Given
      const input = TEXT_WITH_80_CHARACTERS;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(input);
    });

    it('feeding a sentence with 81 characters > should split sentence (and not split any word)', () => {
      // Given
      const input = TEXT_WITH_81_CHARACTERS;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(TEXT_WITH_81_CHARACTERS_JUSTIFIED);
    });

    it('feeding paragraph > should split into sentences', () => {
      // Given
      const input = TEXT_WITH_ONE_PARAGRAPH;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(TEXT_WITH_ONE_PARAGRAPH_JUSTIFIED);
    });

    it('feeding paragraphs > should split into sentences and put a line break inbetween the paragraphs', () => {
      // Given
      const input = TEXT_WITH_TWO_PARAGRAPHS;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(TEXT_WITH_TWO_PARAGRAPHS_JUSTIFIED);
    });

    it('feeding lines smaller than 80 characters with line breaks in between > should return them', () => {
      // Given
      const input = TEXT_MULTIPLE_LINES_UNDER_80_CHARACTERS;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(TEXT_MULTIPLE_LINES_UNDER_80_CHARACTERS);
    });

    it('feeding text with empty first line, then text > should return the first empty line, then justified text', () => {
      // Given
      const input = TEXT_WITH_EMPTY_FIRST_LINE;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(TEXT_WITH_EMPTY_FIRST_LINE_JUSTIFIED);
    });

    it('feeding a long word over 3 lines > should return the splitted word', () => {
      // Given
      const input = WORD_WITH_161_CHARACTERS;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(WORD_WITH_161_CHARACTERS_SPLITTED.join('\n'));
    });

    it('feeding a long text with a long word > should return the justified text, splitting the word', () => {
      // Given
      const input = LONG_TEXT_WITH_LONG_WORD;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(LONG_TEXT_WITH_LONG_WORD_JUSTIFIED);
    });

    it('feeding a long text with a long word and then more text > should return the justified text, splitting the word, and justified text after', () => {
      // Given
      const input = LONG_TEXT_WITH_LONG_WORD_AND_MORE_TEXT;

      // When
      const output = justify(input, MAX_LENGTH);

      // Then
      expect(output).toBe(LONG_TEXT_WITH_LONG_WORD_AND_MORE_TEXT_JUSTIFIED);
    });
  });

  describe('splitWord()', () => {
    it('feeding long word with 81 characters and no firstIterationEnd > should return the splitted word', () => {
      // Given
      const input = WORD_WITH_81_CHARACTERS;
      const firstIterationEnd = MAX_LENGTH;

      // When
      const output = splitWord(input, firstIterationEnd, MAX_LENGTH);

      // Then
      expect(output).toStrictEqual(WORD_WITH_81_CHARACTERS_SPLITTED);
    });

    it('feeding long word over 3 lines and no firstIterationEnd > should return the splitted word', () => {
      // Given
      const input = WORD_WITH_161_CHARACTERS;
      const firstIterationEnd = MAX_LENGTH;

      // When
      const output = splitWord(input, firstIterationEnd, MAX_LENGTH);

      // Then
      expect(output).toStrictEqual(WORD_WITH_161_CHARACTERS_SPLITTED);
    });

    it('feeding long word over 3 lines and firstIterationEnd > should return the splitted word and respect first offset', () => {
      // Given
      const input = WORD_WITH_161_CHARACTERS;
      const firstIterationEnd = 47;

      // When
      const output = splitWord(input, firstIterationEnd, MAX_LENGTH);

      // Then
      expect(output).toStrictEqual(
        WORD_WITH_161_CHARACTERS_SPLITTED_FIRST_ITERATION_47,
      );
    });
  });
});
