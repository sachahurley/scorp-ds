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

export { Slider } from './components/Slider';
export type { SliderProps } from './components/Slider';

export { Radio } from './components/Radio';
export type { RadioProps } from './components/Radio';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { Dropdown } from './components/Dropdown';
export type { DropdownProps, DropdownItem } from './components/Dropdown';

export { CaseStudyBlocks } from './components/CaseStudy';
export type { CaseStudyBlock } from './components/CaseStudy';

export { ListRow } from './components/ListRow';
export type { ListRowProps } from './components/ListRow';

export { Toast, Toaster } from './components/Toast';
export type { ToastItem, ToasterProps } from './components/Toast';

export { BottomSheet } from './components/BottomSheet';
export type { BottomSheetProps } from './components/BottomSheet';

export { ThemeToggle } from './components/ThemeToggle';

export { TuiIcon, TUI_ICON_GLYPHS } from './components/TuiIcon';
export type { TuiIconProps, TuiIconName } from './components/TuiIcon';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './components/Tabs';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from './components/Table';
export type {
  TableDensity,
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
} from './components/Table';

// Primitives
export { Stack } from './primitives/Stack';
export type { StackProps, StackGap } from './primitives/Stack';

// Lab barrel (empty — add as experimental components are built)
// export * from './lab';

// Theme
export { ThemeProvider } from './theme/ThemeProvider';

// Utilities
export { cn } from './lib/utils';
