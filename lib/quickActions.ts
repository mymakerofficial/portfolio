export interface QuickActionGroup {
  displayName: string;
  key: string;
  items: QuickActionItem[];
}

export interface QuickActionExtendedGroup extends QuickActionGroup {
  items: QuickActionExtendedItem[];
}


export interface QuickActionItem {
  displayName: string;
  key: string;
  action: () => void;
}

export interface QuickActionExtendedItem extends QuickActionItem {
  keyWords: string[];
}
