declare module "react-grid-layout" {
  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
  }

  export interface Layouts {
    [key: string]: Layout[];
  }

  interface GridLayoutProps {
    className?: string;
    style?: React.CSSProperties;
    width?: number;
    autoSize?: boolean;
    cols?: number;
    draggableHandle?: string;
    draggableCancel?: string;
    containerPadding?: [number, number];
    rowHeight?: number;
    maxRows?: number;
    layout: Layout[];
    margin?: [number, number];
    isBounded?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    isDroppable?: boolean;
    compactType?: "vertical" | "horizontal" | null;
    preventCollision?: boolean;
    useCSSTransforms?: boolean;
    transformScale?: number;
    droppingItem?: { i: string; w: number; h: number };
    onLayoutChange?: (layout: Layout[]) => void;
    onDragStart?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => void;
    onDrag?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => void;
    onDragStop?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => void;
    onResizeStart?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => void;
    onResize?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => void;
    onResizeStop?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => void;
    children?: React.ReactNode;
  }

  export default class GridLayout extends React.Component<GridLayoutProps> {}
  export class Responsive extends React.Component<GridLayoutProps> {}
  export { WidthProvider as useWidthProvider } from "./utils";
}
