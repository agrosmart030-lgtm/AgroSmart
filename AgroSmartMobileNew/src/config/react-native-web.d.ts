// Extensões de tipos para React Native Web
declare module 'react-native-web' {
  import { ComponentType } from 'react';
  import { ViewProps, TextProps, ImageProps, ScrollViewProps } from 'react-native';

  export const View: ComponentType<ViewProps>;
  export const Text: ComponentType<TextProps>;
  export const Image: ComponentType<ImageProps>;
  export const ScrollView: ComponentType<ScrollViewProps>;
  
  // Adicione outros componentes conforme necessário
  
  export * from 'react-native';
}

// Extensão para arquivos de imagem
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
