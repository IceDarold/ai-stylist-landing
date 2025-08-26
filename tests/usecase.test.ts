import { describe, it, expect } from 'vitest';
import { validateUseCases } from '../src/lib/usecaseValidation';

describe('validateUseCases', () => {
  it('validates correct selection', () => {
    const res = validateUseCases([
      { id: 'office', priority: 1, props: { dress_code: 'smart_casual' } },
      { id: 'season', priority: 2, props: { season: 'aw' } },
    ]);
    expect(res).toBe(true);
  });

  it('rejects more than three', () => {
    const res = validateUseCases([
      { id: 'office', priority: 1 },
      { id: 'season', priority: 2 },
      { id: 'event', priority: 3 },
      { id: 'travel', priority: 1 },
    ]);
    expect(res).toBe(false);
  });

  it('rejects duplicate priority', () => {
    const res = validateUseCases([
      { id: 'office', priority: 1 },
      { id: 'season', priority: 1 },
    ]);
    expect(res).toBe(false);
  });

  it('rejects invalid prop', () => {
    const res = validateUseCases([
      { id: 'office', priority: 1, props: { dress_code: 'invalid' } },
    ]);
    expect(res).toBe(false);
  });
});
