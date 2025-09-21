// Extensões de tipos para React Native Gesture Handler
declare module 'react-native-gesture-handler' {
  import { ComponentType, RefAttributes } from 'react';
  import { ViewProps, Animated } from 'react-native';

  export interface PanGestureHandlerProperties extends ViewProps {
    enabled?: boolean;
    shouldCancelWhenOutside?: boolean;
    simultaneousHandlers?: any;
    waitFor?: any;
    hitSlop?: number | { left?: number; right?: number; top?: number; bottom?: number; vertical?: number; horizontal?: number; width?: number; height?: number };
    activeOffsetX?: number | number[];
    activeOffsetY?: number | number[];
    failOffsetX?: number | number[];
    failOffsetY?: number | number[];
    minDist?: number;
    minVelocity?: number;
    minVelocityX?: number;
    minVelocityY?: number;
    minPointers?: number;
    maxPointers?: number;
    avgTouches?: boolean;
    onGestureEvent?: (event: any) => void;
    onHandlerStateChange?: (event: any) => void;
  }

  export const PanGestureHandler: ComponentType<PanGestureHandlerProperties & RefAttributes<View>>;
  export const TapGestureHandler: ComponentType<any>;
  export const LongPressGestureHandler: ComponentType<any>;
  export const PinchGestureHandler: ComponentType<any>;
  export const RotationGestureHandler: ComponentType<any>;
  export const FlingGestureHandler: ComponentType<any>;
  export const ForceTouchGestureHandler: ComponentType<any>;
  export const NativeViewGestureHandler: ComponentType<any>;
  export const GestureHandlerRootView: ComponentType<ViewProps>;
  
  export const State: {
    UNDETERMINED: number;
    FAILED: number;
    BEGAN: number;
    CANCELLED: number;
    ACTIVE: number;
    END: number;
  };

  export const Directions: {
    RIGHT: number;
    LEFT: number;
    UP: number;
    DOWN: number;
  };

  export const gestureHandlerRootHOC: <T extends ComponentType<any>>(Component: T) => T;
  export const createNativeWrapper: <T extends ComponentType<any>>(Component: T, config?: any) => T;

  // Componentes de UI
  export const RectButton: ComponentType<any>;
  export const BorderlessButton: ComponentType<any>;
  export const TouchableOpacity: ComponentType<any>;
  export const TouchableHighlight: ComponentType<any>;
  export const TouchableWithoutFeedback: ComponentType<any>;
  export const TouchableNativeFeedback: ComponentType<any>;
  export const ScrollView: ComponentType<any>;
  export const FlatList: ComponentType<any>;
  export const Switch: ComponentType<any>;
  export const TextInput: ComponentType<any>;
  export const DrawerLayoutAndroid: ComponentType<any>;
  export const ToolbarAndroid: ComponentType<any>;
  export const ViewPagerAndroid: ComponentType<any>;
  export const WebView: ComponentType<any>;
  
  // Outros componentes e tipos
  export const Swipeable: ComponentType<any>;
  export const DrawerLayout: ComponentType<any>;
  
  // Hooks
  export function useGestureHandlerRef(): any;
  export function useAnimatedGestureHandler(handlers: any, deps?: any[]): any;
  export function useAnimatedStyle(updater: () => any, deps?: any[]): any;
  export function useAnimatedRef<T>(): any;
  export function useAnimatedScrollHandler(handlers: any, deps?: any[]): any;
  export function useAnimatedProps(updater: () => any, deps?: any[]): any;
  export function useAnimatedReaction<T>(
    prepare: () => T,
    react: (result: T, previous: T | null) => void,
    deps?: any[]
  ): void;
  export function useAnimatedScrollHandler(handlers: any, deps?: any[]): any;
  export function useAnimatedStyle(updater: () => any, deps?: any[]): any;
  export function useDerivedValue<T>(processor: () => T, deps?: any[]): Animated.SharedValue<T>;
  export function useSharedValue<T>(value: T): Animated.SharedValue<T>;
  export function useWorkletCallback<Args extends any[], R>(
    fn: (...args: Args) => R,
    deps?: any[]
  ): (...args: Args) => R;
}
