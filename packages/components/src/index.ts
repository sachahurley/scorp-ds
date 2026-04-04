/**
 * @scorp-ds/components
 *
 * Scorp DS React component library.
 * TUI-inspired, built entirely from design tokens.
 *
 * Usage:
 *   import { Button, Card, Badge } from '@scorp-ds/components';
 *   import '@scorp-ds/components/styles'; // import CSS variables
 */

// Components
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { Card } from './components/Card';
export type { CardProps } from './components/Card';

export { Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge';

export { Alert } from './components/Alert';
export type { AlertProps } from './components/Alert';

export { Avatar } from './components/Avatar';
export type { AvatarProps } from './components/Avatar';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps } from './components/Tooltip';

export { Select } from './components/Select';
export type { SelectProps } from './components/Select';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Radio } from './components/Radio';
export type { RadioProps } from './components/Radio';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { Dropdown } from './components/Dropdown';
export type { DropdownProps, DropdownItem } from './components/Dropdown';

export { ThemeToggle } from './components/ThemeToggle';

export { TuiIcon } from './components/TuiIcon';
export type { TuiIconProps } from './components/TuiIcon';

// Primitives barrel (empty — add as primitives are built)
// export * from './primitives';

// Lab barrel (empty — add as experimental components are built)
// export * from './lab';

// Theme
export { ThemeProvider } from './theme/ThemeProvider';

// Utilities
export { cn } from './lib/utils';
