import { today } from './date.util';

describe('DateUtil', () => {
  it('today', () => {
    // Given
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    // When
    const output = today();

    // Then
    expect(output).toEqual('2020-01-01');
  });
});
