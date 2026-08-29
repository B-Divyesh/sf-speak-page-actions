import { describe, expect, it } from 'vitest';
import { commandTarget, findAction, isDestructive, normaliseWords, type PageAction } from '../src/lib/actions';

const actions: PageAction[] = [
  { id: 'a', label: 'Save address', kind: 'button', destructive: false },
  { id: 'b', label: 'Delete saved draft', kind: 'button', destructive: true },
];
describe('spoken command matching', () => {
  it('matches a visible label without a numbered overlay', () => expect(findAction('click save address', actions)?.id).toBe('a'));
  it('normalises speech punctuation', () => expect(commandTarget('Click, Save address!')).toBe('save address'));
  it('marks risky page labels for review', () => expect(isDestructive('Delete saved draft')).toBe(true));
  it('marks a destructive label when inline page text runs together', () => expect(isDestructive('BUTTONDelete saved draft review')).toBe(true));
  it('keeps words stable', () => expect(normaliseWords('Review  order')).toBe('review order'));
});
