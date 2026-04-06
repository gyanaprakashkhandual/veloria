import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TreeSize = "sm" | "md" | "lg" | "xl";
export type TreeVariant = "default" | "filled" | "ghost" | "outline";
export type TreeSelectionMode = "none" | "single" | "multiple";

export interface TreeNodeData {
  /** Unique id */
  id: string;
  /** Display label */
  label: React.ReactNode;
  /** Optional sublabel / description shown below label */
  sublabel?: React.ReactNode;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Optional trailing element (badge, tag, action) */
  trailing?: React.ReactNode;
  /** Child nodes */
  children?: TreeNodeData[];
  /** If true, signals children should be loaded async — show loader on expand */
  hasChildren?: boolean;
  /** Whether this node is disabled (not selectable, not expandable) */
  disabled?: boolean;
  /** Whether this node is locked (renders a lock icon, no expand/select) */
  locked?: boolean;
  /** Whether this node is initially expanded */
  defaultExpanded?: boolean;
  /** Arbitrary metadata */
  meta?: Record<string, unknown>;
}

// ─── State ────────────────────────────────────────────────────────────────────

export interface TreeState {
  expandedIds: Set<string>;
  selectedIds: Set<string>;
  checkedIds: Set<string>;        // checkbox-mode checked leaves
  indeterminateIds: Set<string>;  // checkbox-mode partial parents
  focusedId: string | null;
  loadingIds: Set<string>;        // async children loading
  dragOverId: string | null;
  draggingId: string | null;
  filterQuery: string;
}

type TreeAction =
  | { type: "EXPAND"; id: string }
  | { type: "COLLAPSE"; id: string }
  | { type: "TOGGLE_EXPAND"; id: string }
  | { type: "EXPAND_ALL"; ids: string[] }
  | { type: "COLLAPSE_ALL" }
  | { type: "SELECT"; id: string }
  | { type: "DESELECT"; id: string }
  | { type: "TOGGLE_SELECT"; id: string }
  | { type: "SELECT_ALL"; ids: string[] }
  | { type: "DESELECT_ALL" }
  | { type: "CHECK"; id: string }
  | { type: "UNCHECK"; id: string }
  | { type: "SET_CHECKED"; checkedIds: Set<string>; indeterminateIds: Set<string> }
  | { type: "SET_FOCUS"; id: string | null }
  | { type: "SET_LOADING"; id: string; loading: boolean }
  | { type: "SET_DRAG_OVER"; id: string | null }
  | { type: "SET_DRAGGING"; id: string | null }
  | { type: "SET_FILTER"; query: string }
  | { type: "RESET" };

function treeReducer(state: TreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case "EXPAND": {
      const next = new Set(state.expandedIds);
      next.add(action.id);
      return { ...state, expandedIds: next };
    }
    case "COLLAPSE": {
      const next = new Set(state.expandedIds);
      next.delete(action.id);
      return { ...state, expandedIds: next };
    }
    case "TOGGLE_EXPAND": {
      const next = new Set(state.expandedIds);
      if (next.has(action.id)) next.delete(action.id);
      else next.add(action.id);
      return { ...state, expandedIds: next };
    }
    case "EXPAND_ALL":
      return { ...state, expandedIds: new Set(action.ids) };
    case "COLLAPSE_ALL":
      return { ...state, expandedIds: new Set() };
    case "SELECT": {
      const next = new Set(state.selectedIds);
      next.add(action.id);
      return { ...state, selectedIds: next };
    }
    case "DESELECT": {
      const next = new Set(state.selectedIds);
      next.delete(action.id);
      return { ...state, selectedIds: next };
    }
    case "TOGGLE_SELECT": {
      const next = new Set(state.selectedIds);
      if (next.has(action.id)) next.delete(action.id);
      else next.add(action.id);
      return { ...state, selectedIds: next };
    }
    case "SELECT_ALL":
      return { ...state, selectedIds: new Set(action.ids) };
    case "DESELECT_ALL":
      return { ...state, selectedIds: new Set() };
    case "SET_CHECKED":
      return { ...state, checkedIds: action.checkedIds, indeterminateIds: action.indeterminateIds };
    case "SET_FOCUS":
      return { ...state, focusedId: action.id };
    case "SET_LOADING": {
      const next = new Set(state.loadingIds);
      if (action.loading) next.add(action.id);
      else next.delete(action.id);
      return { ...state, loadingIds: next };
    }
    case "SET_DRAG_OVER":
      return { ...state, dragOverId: action.id };
    case "SET_DRAGGING":
      return { ...state, draggingId: action.id };
    case "SET_FILTER":
      return { ...state, filterQuery: action.query };
    case "RESET":
      return {
        ...state,
        expandedIds: new Set(),
        selectedIds: new Set(),
        checkedIds: new Set(),
        indeterminateIds: new Set(),
        focusedId: null,
        loadingIds: new Set(),
        dragOverId: null,
        draggingId: null,
        filterQuery: "",
      };
    default:
      return state;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Collect all node ids recursively */
export function collectAllIds(nodes: TreeNodeData[]): string[] {
  const ids: string[] = [];
  function walk(list: TreeNodeData[]) {
    for (const node of list) {
      ids.push(node.id);
      if (node.children?.length) walk(node.children);
    }
  }
  walk(nodes);
  return ids;
}

/** Collect ids of nodes that have children (branch nodes) */
export function collectBranchIds(nodes: TreeNodeData[]): string[] {
  const ids: string[] = [];
  function walk(list: TreeNodeData[]) {
    for (const node of list) {
      if ((node.children && node.children.length > 0) || node.hasChildren) {
        ids.push(node.id);
      }
      if (node.children?.length) walk(node.children);
    }
  }
  walk(nodes);
  return ids;
}

/** Collect ids of selectable leaf nodes */
export function collectLeafIds(nodes: TreeNodeData[]): string[] {
  const ids: string[] = [];
  function walk(list: TreeNodeData[]) {
    for (const node of list) {
      if ((!node.children || node.children.length === 0) && !node.hasChildren) {
        if (!node.disabled && !node.locked) ids.push(node.id);
      } else {
        if (node.children?.length) walk(node.children);
      }
    }
  }
  walk(nodes);
  return ids;
}

/** Build a flat ordered list for keyboard navigation */
export function buildVisibleOrder(
  nodes: TreeNodeData[],
  expandedIds: Set<string>,
  filterQuery: string,
): string[] {
  const order: string[] = [];
  const q = filterQuery.toLowerCase();

  function nodeMatchesFilter(node: TreeNodeData): boolean {
    if (!q) return true;
    const label = typeof node.label === "string" ? node.label.toLowerCase() : "";
    if (label.includes(q)) return true;
    if (node.children?.some((c) => nodeMatchesFilter(c))) return true;
    return false;
  }

  function walk(list: TreeNodeData[]) {
    for (const node of list) {
      if (q && !nodeMatchesFilter(node)) continue;
      order.push(node.id);
      const hasKids = (node.children && node.children.length > 0) || node.hasChildren;
      if (hasKids && expandedIds.has(node.id) && node.children?.length) {
        walk(node.children);
      }
    }
  }
  walk(nodes);
  return order;
}

/** Compute checked/indeterminate sets from a set of leaf checked ids */
export function computeCheckState(
  nodes: TreeNodeData[],
  checkedLeafIds: Set<string>,
): { checkedIds: Set<string>; indeterminateIds: Set<string> } {
  const checkedIds = new Set<string>(checkedLeafIds);
  const indeterminateIds = new Set<string>();

  function walk(list: TreeNodeData[]): "none" | "some" | "all" {
    // returns state for siblings
    let allChecked = true;
    let anyChecked = false;

    for (const node of list) {
      const hasKids = node.children && node.children.length > 0;
      if (hasKids) {
        const childState = walk(node.children!);
        if (childState === "all") {
          checkedIds.add(node.id);
          anyChecked = true;
        } else if (childState === "some") {
          indeterminateIds.add(node.id);
          checkedIds.delete(node.id);
          allChecked = false;
          anyChecked = true;
        } else {
          checkedIds.delete(node.id);
          allChecked = false;
        }
      } else {
        if (checkedLeafIds.has(node.id)) {
          anyChecked = true;
        } else {
          allChecked = false;
        }
      }
    }

    if (allChecked && anyChecked) return "all";
    if (anyChecked) return "some";
    return "none";
  }

  walk(nodes);
  return { checkedIds, indeterminateIds };
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface TreeContextValue {
  state: TreeState;
  nodes: TreeNodeData[];
  // Expand / collapse
  expand: (id: string) => void;
  collapse: (id: string) => void;
  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  isExpanded: (id: string) => boolean;
  // Selection
  select: (id: string) => void;
  deselect: (id: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;
  // Checkbox
  checkNode: (id: string) => void;
  uncheckNode: (id: string) => void;
  toggleCheck: (id: string) => void;
  isChecked: (id: string) => boolean;
  isIndeterminate: (id: string) => boolean;
  // Focus (keyboard)
  focusNode: (id: string | null) => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
  // Loading
  setLoading: (id: string, loading: boolean) => void;
  isLoading: (id: string) => boolean;
  // Filter
  setFilter: (query: string) => void;
  // Drag
  setDragOver: (id: string | null) => void;
  setDragging: (id: string | null) => void;
  // Reset
  reset: () => void;
  // Config
  size: TreeSize;
  variant: TreeVariant;
  selectionMode: TreeSelectionMode;
  checkable: boolean;
  draggable: boolean;
  showConnectors: boolean;
  // Callbacks
  onNodeClick?: (node: TreeNodeData) => void;
  onNodeExpand?: (node: TreeNodeData, expanded: boolean) => void;
  onNodeSelect?: (node: TreeNodeData, selected: boolean) => void;
  onNodeCheck?: (node: TreeNodeData, checked: boolean, checkedIds: string[]) => void;
  onNodeDrop?: (dragId: string, dropId: string) => void;
  onLoadChildren?: (node: TreeNodeData) => Promise<TreeNodeData[]>;
}

const TreeContext = createContext<TreeContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface TreeProviderProps {
  children: React.ReactNode;
  nodes: TreeNodeData[];
  size?: TreeSize;
  variant?: TreeVariant;
  selectionMode?: TreeSelectionMode;
  /** Show checkbox on each node */
  checkable?: boolean;
  /** Allow drag-and-drop reorder */
  draggable?: boolean;
  /** Show vertical connector lines between siblings */
  showConnectors?: boolean;
  /** Default expanded node ids */
  defaultExpanded?: string[];
  /** Default selected node ids */
  defaultSelected?: string[];
  /** Default checked node ids (leaf ids, parents computed) */
  defaultChecked?: string[];
  onNodeClick?: (node: TreeNodeData) => void;
  onNodeExpand?: (node: TreeNodeData, expanded: boolean) => void;
  onNodeSelect?: (node: TreeNodeData, selected: boolean) => void;
  onNodeCheck?: (node: TreeNodeData, checked: boolean, checkedIds: string[]) => void;
  onNodeDrop?: (dragId: string, dropId: string) => void;
  onLoadChildren?: (node: TreeNodeData) => Promise<TreeNodeData[]>;
}

export function TreeProvider({
  children,
  nodes,
  size = "md",
  variant = "default",
  selectionMode = "single",
  checkable = false,
  draggable = false,
  showConnectors = true,
  defaultExpanded = [],
  defaultSelected = [],
  defaultChecked = [],
  onNodeClick,
  onNodeExpand,
  onNodeSelect,
  onNodeCheck,
  onNodeDrop,
  onLoadChildren,
}: TreeProviderProps) {
  // Build initial expanded set — merge defaultExpanded + nodes with defaultExpanded=true
  const initialExpanded = useMemo(() => {
    const ids = new Set<string>(defaultExpanded);
    function walk(list: TreeNodeData[]) {
      for (const n of list) {
        if (n.defaultExpanded) ids.add(n.id);
        if (n.children?.length) walk(n.children);
      }
    }
    walk(nodes);
    return ids;
  }, []); // eslint-disable-line

  const initialChecked = useMemo(() => {
    const leafSet = new Set<string>(defaultChecked);
    return computeCheckState(nodes, leafSet);
  }, []); // eslint-disable-line

  const [state, dispatch] = useReducer(treeReducer, {
    expandedIds: initialExpanded,
    selectedIds: new Set<string>(defaultSelected),
    checkedIds: initialChecked.checkedIds,
    indeterminateIds: initialChecked.indeterminateIds,
    focusedId: null,
    loadingIds: new Set<string>(),
    dragOverId: null,
    draggingId: null,
    filterQuery: "",
  });

  // Visible order for keyboard nav
  const visibleOrder = useMemo(
    () => buildVisibleOrder(nodes, state.expandedIds, state.filterQuery),
    [nodes, state.expandedIds, state.filterQuery],
  );

  const allIds = useMemo(() => collectAllIds(nodes), [nodes]);
  const branchIds = useMemo(() => collectBranchIds(nodes), [nodes]);
  const leafIds = useMemo(() => collectLeafIds(nodes), [nodes]);

  // ── Expand / Collapse ──────────────────────────────────────────────────────

  const expand = useCallback(
    async (id: string) => {
      dispatch({ type: "EXPAND", id });
      // Async children
      const node = findNode(nodes, id);
      if (node && node.hasChildren && !node.children?.length && onLoadChildren) {
        dispatch({ type: "SET_LOADING", id, loading: true });
        try {
          await onLoadChildren(node);
        } finally {
          dispatch({ type: "SET_LOADING", id, loading: false });
        }
      }
      if (node) onNodeExpand?.(node, true);
    },
    [nodes, onLoadChildren, onNodeExpand],
  );

  const collapse = useCallback(
    (id: string) => {
      dispatch({ type: "COLLAPSE", id });
      const node = findNode(nodes, id);
      if (node) onNodeExpand?.(node, false);
    },
    [nodes, onNodeExpand],
  );

  const toggleExpand = useCallback(
    (id: string) => {
      if (state.expandedIds.has(id)) collapse(id);
      else expand(id);
    },
    [state.expandedIds, expand, collapse],
  );

  const expandAll = useCallback(() => {
    dispatch({ type: "EXPAND_ALL", ids: branchIds });
  }, [branchIds]);

  const collapseAll = useCallback(() => {
    dispatch({ type: "COLLAPSE_ALL" });
  }, []);

  const isExpanded = useCallback(
    (id: string) => state.expandedIds.has(id),
    [state.expandedIds],
  );

  // ── Selection ──────────────────────────────────────────────────────────────

  const select = useCallback(
    (id: string) => {
      if (selectionMode === "single") {
        dispatch({ type: "SELECT_ALL", ids: [id] });
      } else {
        dispatch({ type: "SELECT", id });
      }
      const node = findNode(nodes, id);
      if (node) onNodeSelect?.(node, true);
    },
    [selectionMode, nodes, onNodeSelect],
  );

  const deselect = useCallback(
    (id: string) => {
      dispatch({ type: "DESELECT", id });
      const node = findNode(nodes, id);
      if (node) onNodeSelect?.(node, false);
    },
    [nodes, onNodeSelect],
  );

  const toggleSelect = useCallback(
    (id: string) => {
      if (state.selectedIds.has(id)) deselect(id);
      else select(id);
    },
    [state.selectedIds, select, deselect],
  );

  const selectAll = useCallback(() => {
    dispatch({ type: "SELECT_ALL", ids: allIds });
  }, [allIds]);

  const deselectAll = useCallback(() => {
    dispatch({ type: "DESELECT_ALL" });
  }, []);

  const isSelected = useCallback(
    (id: string) => state.selectedIds.has(id),
    [state.selectedIds],
  );

  // ── Checkbox ───────────────────────────────────────────────────────────────

  const applyCheck = useCallback(
    (newLeafIds: Set<string>) => {
      const { checkedIds, indeterminateIds } = computeCheckState(nodes, newLeafIds);
      dispatch({ type: "SET_CHECKED", checkedIds, indeterminateIds });
      return checkedIds;
    },
    [nodes],
  );

  const checkNode = useCallback(
    (id: string) => {
      // If branch, check all descendants
      const descendantLeaves = collectDescendantLeafIds(nodes, id);
      const nextLeafs = new Set(state.checkedIds);
      if (descendantLeaves.length) {
        descendantLeaves.forEach((lid) => nextLeafs.add(lid));
      } else {
        nextLeafs.add(id);
      }
      const checkedIds = applyCheck(nextLeafs);
      const node = findNode(nodes, id);
      if (node) onNodeCheck?.(node, true, Array.from(checkedIds));
    },
    [nodes, state.checkedIds, applyCheck, onNodeCheck],
  );

  const uncheckNode = useCallback(
    (id: string) => {
      const descendantLeaves = collectDescendantLeafIds(nodes, id);
      const nextLeafs = new Set(state.checkedIds);
      if (descendantLeaves.length) {
        descendantLeaves.forEach((lid) => nextLeafs.delete(lid));
      } else {
        nextLeafs.delete(id);
      }
      const checkedIds = applyCheck(nextLeafs);
      const node = findNode(nodes, id);
      if (node) onNodeCheck?.(node, false, Array.from(checkedIds));
    },
    [nodes, state.checkedIds, applyCheck, onNodeCheck],
  );

  const toggleCheck = useCallback(
    (id: string) => {
      if (state.indeterminateIds.has(id) || !state.checkedIds.has(id)) checkNode(id);
      else uncheckNode(id);
    },
    [state.checkedIds, state.indeterminateIds, checkNode, uncheckNode],
  );

  const isChecked = useCallback(
    (id: string) => state.checkedIds.has(id),
    [state.checkedIds],
  );

  const isIndeterminate = useCallback(
    (id: string) => state.indeterminateIds.has(id),
    [state.indeterminateIds],
  );

  // ── Focus / Keyboard nav ──────────────────────────────────────────────────

  const focusNode = useCallback((id: string | null) => {
    dispatch({ type: "SET_FOCUS", id });
  }, []);

  const focusNext = useCallback(() => {
    const idx = state.focusedId ? visibleOrder.indexOf(state.focusedId) : -1;
    const next = visibleOrder[Math.min(idx + 1, visibleOrder.length - 1)];
    if (next) dispatch({ type: "SET_FOCUS", id: next });
  }, [state.focusedId, visibleOrder]);

  const focusPrev = useCallback(() => {
    const idx = state.focusedId ? visibleOrder.indexOf(state.focusedId) : visibleOrder.length;
    const prev = visibleOrder[Math.max(idx - 1, 0)];
    if (prev) dispatch({ type: "SET_FOCUS", id: prev });
  }, [state.focusedId, visibleOrder]);

  const focusFirst = useCallback(() => {
    if (visibleOrder[0]) dispatch({ type: "SET_FOCUS", id: visibleOrder[0] });
  }, [visibleOrder]);

  const focusLast = useCallback(() => {
    const last = visibleOrder[visibleOrder.length - 1];
    if (last) dispatch({ type: "SET_FOCUS", id: last });
  }, [visibleOrder]);

  // ── Loading ────────────────────────────────────────────────────────────────

  const setLoading = useCallback((id: string, loading: boolean) => {
    dispatch({ type: "SET_LOADING", id, loading });
  }, []);

  const isLoading = useCallback(
    (id: string) => state.loadingIds.has(id),
    [state.loadingIds],
  );

  // ── Filter ─────────────────────────────────────────────────────────────────

  const setFilter = useCallback((query: string) => {
    dispatch({ type: "SET_FILTER", query });
    // Auto-expand all branches when filtering
    if (query) dispatch({ type: "EXPAND_ALL", ids: branchIds });
  }, [branchIds]);

  // ── Drag ───────────────────────────────────────────────────────────────────

  const setDragOver = useCallback((id: string | null) => {
    dispatch({ type: "SET_DRAG_OVER", id });
  }, []);

  const setDragging = useCallback((id: string | null) => {
    dispatch({ type: "SET_DRAGGING", id });
  }, []);

  // ── Reset ──────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return (
    <TreeContext.Provider
      value={{
        state,
        nodes,
        expand,
        collapse,
        toggleExpand,
        expandAll,
        collapseAll,
        isExpanded,
        select,
        deselect,
        toggleSelect,
        selectAll,
        deselectAll,
        isSelected,
        checkNode,
        uncheckNode,
        toggleCheck,
        isChecked,
        isIndeterminate,
        focusNode,
        focusNext,
        focusPrev,
        focusFirst,
        focusLast,
        setLoading,
        isLoading,
        setFilter,
        setDragOver,
        setDragging,
        reset,
        size,
        variant,
        selectionMode,
        checkable,
        draggable,
        showConnectors,
        onNodeClick,
        onNodeExpand,
        onNodeSelect,
        onNodeCheck,
        onNodeDrop,
        onLoadChildren,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export function useTreeContext(): TreeContextValue {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error("useTreeContext must be used within TreeProvider");
  return ctx;
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

function findNode(nodes: TreeNodeData[], id: string): TreeNodeData | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function collectDescendantLeafIds(nodes: TreeNodeData[], rootId: string): string[] {
  const root = findNode(nodes, rootId);
  if (!root) return [];
  const leaves: string[] = [];
  function walk(node: TreeNodeData) {
    if (!node.children?.length && !node.hasChildren) {
      if (!node.disabled && !node.locked) leaves.push(node.id);
    } else {
      node.children?.forEach(walk);
    }
  }
  walk(root);
  return leaves;
}