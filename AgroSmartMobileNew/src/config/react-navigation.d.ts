// Extensões de tipos para React Navigation
import { NavigatorScreenParams, ParamListBase } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  // Rotas principais
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  NotFound: undefined;
  
  // Rotas de autenticação
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  
  // Rotas principais
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
  
  // Rotas de navegação aninhada
  [key: string]: undefined | object;
};

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  VerifyEmail: { email: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  CreatePost: undefined;
  Notifications: undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeStackParamList = {
  Feed: undefined;
  PostDetails: { postId: string };
  UserProfile: { userId: string };
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  SavedPosts: undefined;
  MyPosts: undefined;
};

// Tipos de navegação para cada pilha
export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<AuthStackParamList, T>;
export type MainTabScreenProps<T extends keyof MainTabParamList> = StackScreenProps<MainTabParamList, T>;
export type HomeStackScreenProps<T extends keyof HomeStackParamList> = StackScreenProps<HomeStackParamList, T>;
export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = StackScreenProps<ProfileStackParamList, T>;

// Tipos de navegação para uso com useNavigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Tipos para os parâmetros de rota
export type RouteParams<T extends ParamListBase, K extends keyof T> = T[K] extends undefined 
  ? { route: { params?: T[K] } } 
  : { route: { params: T[K] } };

// Tipos para os estilos de cabeçalho
export interface HeaderStyleProps {
  headerStyle?: {
    backgroundColor?: string;
    elevation?: number;
    shadowOpacity?: number;
    borderBottomWidth?: number;
    borderBottomColor?: string;
  };
  headerTitleStyle?: {
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    fontSize?: number;
    color?: string;
  };
  headerTintColor?: string;
  headerBackTitle?: string;
  headerBackTitleStyle?: {
    fontSize?: number;
    color?: string;
  };
  headerBackImage?: (props: { tintColor: string }) => React.ReactNode;
  headerRight?: (props: { tintColor: string; pressColor: string; pressOpacity: number }) => React.ReactNode;
  headerLeft?: (props: { tintColor: string; pressColor: string; pressOpacity: number }) => React.ReactNode;
  headerTitle?: string | ((props: { children: string; tintColor: string }) => React.ReactNode);
  headerTitleAlign?: 'left' | 'center';
  headerTitleAllowFontScaling?: boolean;
  headerBackAllowFontScaling?: boolean;
  headerBackAccessibilityLabel?: string;
  headerBackTestID?: string;
  headerPressColorAndroid?: string;
  headerTransparent?: boolean;
  headerBackground?: () => React.ReactNode;
  headerStatusBarHeight?: number;
  headerShown?: boolean;
  headerShadowVisible?: boolean;
  headerBackVisible?: boolean;
  headerBackButtonMenuEnabled?: boolean;
  headerLeftContainerStyle?: object;
  headerRightContainerStyle?: object;
  headerTitleContainerStyle?: object;
  headerBackgroundContainerStyle?: object;
}

// Tipos para as opções de navegação
export interface NavigationOptions extends HeaderStyleProps {
  title?: string;
  tabBarLabel?: string;
  tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  tabBarBadge?: string | number;
  tabBarBadgeStyle?: object;
  tabBarVisible?: boolean;
  tabBarTestID?: string;
  tabBarAccessibilityLabel?: string;
  tabBarButton?: (props: any) => React.ReactNode;
  tabBarActiveTintColor?: string;
  tabBarInactiveTintColor?: string;
  tabBarActiveBackgroundColor?: string;
  tabBarInactiveBackgroundColor?: string;
  tabBarStyle?: object;
  tabBarItemStyle?: object;
  tabBarLabelStyle?: object;
  tabBarIconStyle?: object;
  tabBarLabelPosition?: 'below-icon' | 'beside-icon';
  tabBarHideOnKeyboard?: boolean;
  tabBarShowLabel?: boolean;
  tabBarShowIcon?: boolean;
  tabBarAllowFontScaling?: boolean;
  tabBarBounces?: boolean;
  tabBarScrollEnabled?: boolean;
  tabBarSafeAreaInsets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  tabBarBackground?: () => React.ReactNode;
  tabBarIndicator?: (props: { state: any; navigation: any }) => React.ReactNode;
  tabBarIndicatorStyle?: object;
  tabBarIndicatorContainerStyle?: object;
  tabBarContentContainerStyle?: object;
  tabBarGap?: number;
  tabBarTestID?: string;
  tabBarAccessibilityLabel?: string;
  tabBarButton?: (props: any) => React.ReactNode;
  tabBarActiveTintColor?: string;
  tabBarInactiveTintColor?: string;
  tabBarActiveBackgroundColor?: string;
  tabBarInactiveBackgroundColor?: string;
  tabBarStyle?: object;
  tabBarItemStyle?: object;
  tabBarLabelStyle?: object;
  tabBarIconStyle?: object;
  tabBarLabelPosition?: 'below-icon' | 'beside-icon';
  tabBarHideOnKeyboard?: boolean;
  tabBarShowLabel?: boolean;
  tabBarShowIcon?: boolean;
  tabBarAllowFontScaling?: boolean;
  tabBarBounces?: boolean;
  tabBarScrollEnabled?: boolean;
  tabBarSafeAreaInsets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  tabBarBackground?: () => React.ReactNode;
  tabBarIndicator?: (props: { state: any; navigation: any }) => React.ReactNode;
  tabBarIndicatorStyle?: object;
  tabBarIndicatorContainerStyle?: object;
  tabBarContentContainerStyle?: object;
  tabBarGap?: number;
}
