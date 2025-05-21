export const theme = {
  colors: {
    dark: {
      background: 'bg-gray-900',
      text: 'text-gray-300',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-800',
      active: 'bg-blue-900/30 text-blue-400',
      card: 'bg-gray-800',
      muted: 'text-gray-400',
    },
    light: {
      background: 'bg-white',
      text: 'text-gray-700',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100',
      active: 'bg-blue-50 text-blue-600',
      card: 'bg-gray-50',
      muted: 'text-gray-500',
    }
  }
};

export type Theme = typeof theme;