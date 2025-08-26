import type { SelectedUseCase } from '@/types/usecase';
import { USE_CASES } from '@/components/quiz/usecases.config';

export function validateUseCases(items: SelectedUseCase[]): boolean {
  if (items.length > 3) return false;
  const priorities = new Set<number>();
  for (const uc of items) {
    if (priorities.has(uc.priority)) return false;
    priorities.add(uc.priority);
    const cfg = USE_CASES.find((c) => c.id === uc.id);
    if (!cfg) return false;
    if (uc.props) {
      for (const [k, v] of Object.entries(uc.props)) {
        const sp = cfg.subprops?.find((s) => s.key === k);
        if (!sp) return false;
        if (!sp.options.includes(v)) return false;
      }
    }
  }
  return true;
}
