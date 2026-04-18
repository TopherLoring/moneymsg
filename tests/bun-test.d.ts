declare module "bun:test" {
  export function describe(label: string, fn: () => void): void;
  export function test(label: string, fn: () => void): void;
  export function expect(value: any): any;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
  export const describe: (...args: any[]) => any;
  export const expect: (...args: any[]) => any;
  export const test: (...args: any[]) => any;
  export const mock: any;
}
