// Extensões de tipos para React Native Reanimated
declare module 'react-native-reanimated' {
  import { ComponentType, RefAttributes, RefObject } from 'react';
  import { ViewStyle, TextStyle, ImageStyle, Animated } from 'react-native';

  // Tipos básicos
  export type Adaptable<T> = T | Animated.Node<number> | Animated.Node<string> | Animated.Node<number[]> | Animated.Node<string[]>;
  export type AdaptTransforms<T> = {
    [P in keyof T]: P extends 'transform'
      ? AdaptTransforms<TransformStyle>[]
      : T[P] extends ReadonlyArray<any>
      ? ReadonlyArray<Adaptable<number | string>>
      : T[P] extends object
      ? AdaptTransforms<T[P]>
      : Adaptable<T[P]> | T[P];
  };

  // Tipos de estilo
  export type AnimateStyle<T> = T extends object
    ? {
        [K in keyof T]: K extends 'transform'
          ? TransformStyle[]
          : T[K] extends ReadonlyArray<any>
          ? ReadonlyArray<Animated.Adaptable<number | string>>
          : T[K] extends object
          ? AnimateStyle<T[K]>
          : T[K] | Animated.Node<Extract<T[K], string | number>>;
      }
    : T;

  export type DerivedValue<T> = { value: T };
  export type SharedValue<T> = { value: T };

  // Hooks
  export function useSharedValue<T>(value: T): SharedValue<T>;
  
  export function useDerivedValue<T>(
    processor: () => T,
    deps?: any[]
  ): DerivedValue<T>;

  export function useAnimatedStyle<
    T extends AnimateStyle<ViewStyle | ImageStyle | TextStyle>
  >(
    updater: () => T,
    deps?: any[] | null
  ): T;

  export function useAnimatedProps<T extends object>(
    updater: () => T,
    deps?: any[] | null
  ): T;

  export function useAnimatedGestureHandler<T extends object>(
    handlers: T,
    deps?: any[]
  ): (e: any) => void;

  export function useAnimatedScrollHandler<T extends object>(
    handler: T,
    deps?: any[]
  ): (e: any) => void;

  export function useAnimatedRef<T>(): RefObject<T>;
  export function useWorkletCallback<A extends any[], R>(
    fn: (...args: A) => R,
    deps?: any[]
  ): (...args: A) => R;

  // Componentes animados
  export const Animated: {
    View: ComponentType<Animated.AnimateProps<ViewStyle>>;
    Text: ComponentType<Animated.AnimateProps<TextStyle>>;
    Image: ComponentType<Animated.AnimateProps<ImageStyle>>;
    ScrollView: ComponentType<Animated.AnimateProps<ViewStyle>>;
    FlatList: ComponentType<any>;
    SectionList: ComponentType<any>;
  };

  // Funções de animação
  export function withSpring(
    toValue: Adaptable<number>,
    config?: SpringConfig
  ): Animated.Node<number>;

  export function withTiming(
    toValue: Adaptable<number>,
    config?: TimingConfig,
    callback?: (finished: boolean) => void
  ): Animated.Node<number>;

  export function withDecay(
    config: DecayConfig,
    callback?: (finished: boolean) => void
  ): Animated.Node<number>;

  export function withDelay(
    delayMS: Adaptable<number>,
    animation: Animated.Node<number>
  ): Animated.Node<number>;

  export function withRepeat(
    animation: Animated.Node<number>,
    numberOfReps?: number,
    reverse?: boolean,
    callback?: (finished: boolean) => void
  ): Animated.Node<number>;

  export function withSequence(
    ...animations: Animated.Node<number>[]
  ): Animated.Node<number>;

  // Configurações de animação
  export interface SpringConfig {
    damping?: number;
    mass?: number;
    stiffness?: number;
    overshootClamping?: boolean;
    restSpeedThreshold?: number;
    restDisplacementThreshold?: number;
    toValue?: number;
  }

  export interface TimingConfig {
    duration?: number;
    easing?: (value: number) => number;
  }

  export interface DecayConfig {
    deceleration?: number;
    velocity?: number;
    clamp?: [number, number];
  }

  // Funções auxiliares
  export function interpolateNode(
    value: Adaptable<number>,
    inputRange: ReadonlyArray<Adaptable<number>>,
    outputRange: ReadonlyArray<Adaptable<number | string>>,
    extrapolate?: ExtrapolateType,
    extrapolateLeft?: ExtrapolateType,
    extrapolateRight?: ExtrapolateType
  ): Animated.Node<number>;

  export type ExtrapolateType = 'extend' | 'identity' | 'clamp';

  // Valores compartilhados
  export function makeMutable<T>(value: T): SharedValue<T>;
  export function makeShareable<T>(value: T): T;
  export function makeRemote<T>(object?: {}): T;

  // Funções de execução
  export function runOnJS<A extends any[], R>(
    fn: (...args: A) => R
  ): (...args: A) => void;

  export function runOnUI<A extends any[], R>(
    fn: (...args: A) => R
  ): (...args: A) => void;

  // Eventos
  export function event<T>(
    argMapping: T[],
    config?: { useNativeDriver: boolean }
  ): (event: any) => void;

  // Utilitários
  export function createAnimatedComponent<P extends object>(
    component: ComponentType<P>
  ): ComponentType<Animated.AnimateProps<P>>;

  export function createAnimatedPropAdapter(
    adapter: (props: Record<string, any>) => void,
    nativeProps?: string[]
  ): (props: Record<string, any>) => void;

  // Constantes
  export const Extrapolate: {
    EXTEND: 'extend';
    CLAMP: 'clamp';
    IDENTITY: 'identity';
  };

  // Hooks adicionais
  export function useAnimatedScrollHandler<T extends object>(
    handlers: T,
    deps?: any[]
  ): (event: any) => void;

  export function useAnimatedReaction<D>(
    prepare: () => D,
    react: (result: D, previousResult: D | null) => void,
    deps?: any[]
  ): void;

  export function useAnimatedRef<T>(): RefObject<T>;
  export function useWorkletCallback<A extends any[], R>(
    fn: (...args: A) => R,
    deps?: any[]
  ): (...args: A) => R;

  // Tipos de eventos
  export interface GestureEvent<T> {
    nativeEvent: T & {
      translationX: number;
      translationY: number;
      x: number;
      y: number;
      velocityX: number;
      velocityY: number;
      state: number;
      oldState?: number;
      numberOfPointers: number;
    };
  }

  export interface PanGestureHandlerEventPayload {
    x: number;
    y: number;
    absoluteX: number;
    absoluteY: number;
    translationX: number;
    translationY: number;
    velocityX: number;
    velocityY: number;
    state: number;
    numberOfPointers: number;
  }

  export interface PinchGestureHandlerEventPayload {
    scale: number;
    focalX: number;
    focalY: number;
    velocity: number;
    state: number;
    numberOfPointers: number;
  }

  export interface RotationGestureHandlerEventPayload {
    rotation: number;
    anchorX: number;
    anchorY: number;
    velocity: number;
    state: number;
  }

  export interface FlingGestureHandlerEventPayload {
    x: number;
    y: number;
    absoluteX: number;
    absoluteY: number;
    state: number;
  }

  export interface ForceTouchGestureHandlerEventPayload {
    x: number;
    y: number;
    absoluteX: number;
    absoluteY: number;
    force: number;
    state: number;
  }

  export interface LongPressGestureHandlerEventPayload {
    x: number;
    y: number;
    absoluteX: number;
    absoluteY: number;
    state: number;
  }

  export interface TapGestureHandlerEventPayload {
    x: number;
    y: number;
    absoluteX: number;
    absoluteY: number;
    state: number;
    numberOfPointers: number;
  }

  // Tipos de gestos
  export type GestureHandlerGestureEventNativeEvent = PanGestureHandlerEventPayload &
    PinchGestureHandlerEventPayload &
    RotationGestureHandlerEventPayload &
    FlingGestureHandlerEventPayload &
    ForceTouchGestureHandlerEventPayload &
    LongPressGestureHandlerEventPayload &
    TapGestureHandlerEventPayload;

  export type GestureHandlerStateChangeNativeEvent = {
    handlerTag: number;
    numberOfPointers: number;
    state: number;
    oldState?: number;
  };

  export type GestureHandlerStateChangeEvent = {
    nativeEvent: GestureHandlerStateChangeNativeEvent;
  };

  // Tipos de estilo
  export type TransformStyle = {
    perspective?: number;
    rotate?: string;
    rotateX?: string;
    rotateY?: string;
    rotateZ?: string;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    translateX?: number;
    translateY?: number;
    skewX?: string;
    skewY?: string;
  };

  // Funções de interpolação
  export function interpolate(
    value: Adaptable<number>,
    inputRange: ReadonlyArray<Adaptable<number>>,
    outputRange: ReadonlyArray<Adaptable<number | string>>,
    extrapolate?: ExtrapolateType,
    extrapolateLeft?: ExtrapolateType,
    extrapolateRight?: ExtrapolateType
  ): Animated.Node<number>;

  export function interpolateColor(
    value: Adaptable<number>,
    inputRange: ReadonlyArray<Adaptable<number>>,
    outputRange: ReadonlyArray<Adaptable<string | number>>,
    colorSpace?: 'RGB' | 'HSV',
    options?: {
      useNativeDriver?: boolean;
    }
  ): Animated.Node<string | number>;
}
