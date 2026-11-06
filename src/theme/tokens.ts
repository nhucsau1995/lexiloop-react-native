// Tokens from design/DESIGN.md (palette P79, after the token contrast check).
export const colors = {
  bg: '#F4FBFC',
  surface: '#FFFFFF',
  surfaceAlt: '#EAF5F7',
  accent: '#00A9CE',
  accentFill: '#007791',
  accentPressed: '#006F88',
  accentTint: '#DDF3F8',
  support: '#A7F797',
  supportStrong: '#25AA08',
  text: '#0C1B1F',
  text2: '#46595E',
  text3: '#5F7277',
  border: '#D5E4E7',
  borderStrong: '#699C9F',
  white: '#FFFFFF',
  success: '#0E7C3A',
  successTint: '#E3F4E9',
  danger: '#CE2020',
  dangerTint: '#FBE5E5',
  info: '#00738C',
  infoTint: '#E0EFF2',
  gradient: ['#007791', '#006F88'] as const,
};

export const font = {
  regular: 'ChakraPetch_400Regular',
  medium: 'ChakraPetch_500Medium',
  semibold: 'ChakraPetch_600SemiBold',
  bold: 'ChakraPetch_700Bold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
};

// Only the 5 type sizes from the design system.
export const size = { display: 32, title: 20, body: 16, label: 14, caption: 13 };

export const radius = { card: 20, control: 14, input: 12, option: 16, pill: 999 };

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, edge: 20 };

export const shadow = {
  shadowColor: '#0C1B1F',
  shadowOpacity: 0.06,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
};
