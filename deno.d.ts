/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace JSX {
    interface Element {
      // deno-lint-ignore no-explicit-any
      [elemName: string]: any;
    }
  }
