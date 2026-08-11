import { FOO_NAME, greetFoo } from '@wuhu-dsm/hot80-foo';

/** POC package: hot80-bar (depends on hot80-foo) */
export const BAR_NAME = '@wuhu-dsm/hot80-bar';

export function greetBar(name: string): string {
  return `bar + ${greetFoo(name)} (via ${FOO_NAME})`;
}
