export interface QuickActionGroup {
  displayName: string;
  key: string;
  items: QuickActionItem[];
}

export interface QuickActionItem {
  displayName: string;
  key: string;
  action: () => void;
}
