/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file allows TypeScript to understand CSS imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}