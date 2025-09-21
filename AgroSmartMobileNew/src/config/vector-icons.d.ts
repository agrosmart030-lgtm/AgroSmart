// Extensões de tipos para React Native Vector Icons
declare module 'react-native-vector-icons/FontAwesome' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/Feather' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/Ionicons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/Entypo' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/FontAwesome5' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
    solid?: boolean;
    brand?: boolean;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/SimpleLineIcons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/Octicons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

// Tipos para o componente de ícones dinâmicos
type IconLibrary = 'FontAwesome' | 'MaterialIcons' | 'Feather' | 'Ionicons' | 'MaterialCommunityIcons' | 'Entypo' | 'FontAwesome5' | 'SimpleLineIcons' | 'Octicons';

interface DynamicIconProps {
  type: IconLibrary;
  name: string;
  size?: number;
  color?: string;
  [key: string]: any;
}

declare module 'react-native-vector-icons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  export function createIconSet(glyphMap: any, fontFamily: string, fontFile?: string): ComponentType<TextProps & { name: string; size?: number; color?: string }>;
  
  export function createMultiStyleIconSet(
    styles: any,
    options?: {
      defaultStyle?: any;
      glyphValidator?: (name: string) => boolean;
      fallbackFamily?: (name: string) => string;
      fallbackClass?: any;
    }
  ): ComponentType<TextProps & { name: string; style?: any }>;

  export const Button: ComponentType<DynamicIconProps>;
  export const getImageSource: (name: string, size?: number, color?: string) => Promise<any>;
  export const getImageSourceSync: (name: string, size?: number, color?: string) => any;
  export const hasIcon: (name: string) => boolean;
  export const getRawGlyphMap: () => any;
  export const getFontFamily: () => string;
  export const getFontStyle: (style?: any) => any;
  export const getImageSourceWithFontFamily: (fontFamily: string, name: string, size?: number, color?: string) => Promise<any>;
  export const getImageSourceWithFontFamilySync: (fontFamily: string, name: string, size?: number, color?: string) => any;
  export const getImageSourceWithFontFamilyAndStyle: (fontFamily: string, name: string, size?: number, color?: string, style?: any) => Promise<any>;
  export const getImageSourceWithFontFamilyAndStyleSync: (fontFamily: string, name: string, size?: number, color?: string, style?: any) => any;
  export const setCustomIconComponent: (component: any) => void;
  export const setCustomIconComponentForFamily: (family: string, component: any) => void;
  export const setCustomIconComponentForFamilyAndName: (family: string, name: string, component: any) => void;
  export const setCustomIconComponentForName: (name: string, component: any) => void;
  export const setCustomIconComponentForType: (type: IconLibrary, component: any) => void;
  export const setCustomIconComponentForTypeAndName: (type: IconLibrary, name: string, component: any) => void;
  export const setCustomIconComponentForTypeAndFamily: (type: IconLibrary, family: string, component: any) => void;
  export const setCustomIconComponentForTypeAndFamilyAndName: (type: IconLibrary, family: string, name: string, component: any) => void;
}
