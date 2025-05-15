// src/types/md.d.ts
declare module '*.md' {
  // front-matter
  export const attributes: Record<string, unknown>;
  // MD como React component
  import { FC } from 'react';
  export const ReactComponent: FC;
  // raw string si lo necesitas
  export const markdown: string;
}
