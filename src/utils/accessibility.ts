// ARIA role types
type AriaRole =
  | 'alert'
  | 'alertdialog'
  | 'button'
  | 'checkbox'
  | 'dialog'
  | 'gridcell'
  | 'link'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'option'
  | 'progressbar'
  | 'radio'
  | 'scrollbar'
  | 'searchbox'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'tabpanel'
  | 'textbox'
  | 'timer'
  | 'tooltip'
  | 'treeitem';

// ARIA attributes interface
interface AriaAttributes {
  role?: AriaRole;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-disabled'?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-pressed'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-haspopup'?: boolean;
  'aria-level'?: number;
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  'aria-busy'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  'aria-atomic'?: boolean;
  'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
  'aria-grabbed'?: boolean;
  'aria-activedescendant'?: string;
  'aria-colcount'?: number;
  'aria-colindex'?: number;
  'aria-colspan'?: number;
  'aria-rowcount'?: number;
  'aria-rowindex'?: number;
  'aria-rowspan'?: number;
  'aria-posinset'?: number;
  'aria-setsize'?: number;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-multiline'?: boolean;
  'aria-multiselectable'?: boolean;
  'aria-readonly'?: boolean;
  'aria-placeholder'?: string;
  'aria-roledescription'?: string;
  'aria-keyshortcuts'?: string;
  'aria-details'?: string;
  'aria-errormessage'?: string;
  'aria-flowto'?: string;
  'aria-modal'?: boolean;
  'aria-owns'?: string;
}

// Keyboard navigation interface
interface KeyboardNavigation {
  key: string;
  handler: (event: KeyboardEvent) => void;
  description: string;
}

class AccessibilityManager {
  private static instance: AccessibilityManager;
  private keyboardShortcuts: Map<string, KeyboardNavigation> = new Map();

  private constructor() {
    this.initializeKeyboardListeners();
  }

  public static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  private initializeKeyboardListeners(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const shortcut = this.getKeyboardShortcut(event);
      const handler = this.keyboardShortcuts.get(shortcut);
      if (handler) {
        handler.handler(event);
      }
    });
  }

  private getKeyboardShortcut(event: KeyboardEvent): string {
    const modifiers = [];
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    if (event.metaKey) modifiers.push('meta');
    
    const key = event.key.toLowerCase();
    return [...modifiers, key].join('+');
  }

  // Register a keyboard shortcut
  public registerKeyboardShortcut(
    key: string,
    handler: (event: KeyboardEvent) => void,
    description: string
  ): void {
    this.keyboardShortcuts.set(key, { key, handler, description });
  }

  // Get all registered keyboard shortcuts
  public getKeyboardShortcuts(): KeyboardNavigation[] {
    return Array.from(this.keyboardShortcuts.values());
  }

  // Generate ARIA attributes for an element
  public generateAriaAttributes(attributes: Partial<AriaAttributes>): AriaAttributes {
    return {
      ...attributes,
    };
  }

  // Create a focus trap for modals and dialogs
  public createFocusTrap(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0] as HTMLElement;
    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstFocusableElement.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }

  // Announce a message to screen readers
  public announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Export a singleton instance
export const accessibilityManager = AccessibilityManager.getInstance(); 