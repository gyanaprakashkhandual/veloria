import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";

export type ImageStatus = "idle" | "loading" | "loaded" | "error";
export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";
export type ImageRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type ImageAspectRatio = "auto" | "square" | "video" | "portrait" | "wide" | "cinema" | string;
export type ImageOverlayTrigger = "always" | "hover" | "never";
export type LightboxTransition = "fade" | "slide" | "zoom";

export interface ImageState {
  status: ImageStatus;
  isLightboxOpen: boolean;
  lightboxIndex: number;
  isZoomed: boolean;
  zoomScale: number;
  isFullscreen: boolean;
}

type ImageAction =
  | { type: "SET_STATUS"; payload: ImageStatus }
  | { type: "OPEN_LIGHTBOX"; payload?: number }
  | { type: "CLOSE_LIGHTBOX" }
  | { type: "SET_LIGHTBOX_INDEX"; payload: number }
  | { type: "TOGGLE_ZOOM" }
  | { type: "SET_ZOOM"; payload: number }
  | { type: "TOGGLE_FULLSCREEN" }
  | { type: "RESET" };

function reducer(state: ImageState, action: ImageAction): ImageState {
  switch (action.type) {
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "OPEN_LIGHTBOX":
      return { ...state, isLightboxOpen: true, lightboxIndex: action.payload ?? state.lightboxIndex, isZoomed: false, zoomScale: 1 };
    case "CLOSE_LIGHTBOX":
      return { ...state, isLightboxOpen: false, isZoomed: false, zoomScale: 1, isFullscreen: false };
    case "SET_LIGHTBOX_INDEX":
      return { ...state, lightboxIndex: action.payload, isZoomed: false, zoomScale: 1 };
    case "TOGGLE_ZOOM":
      return { ...state, isZoomed: !state.isZoomed, zoomScale: state.isZoomed ? 1 : 2.5 };
    case "SET_ZOOM":
      return { ...state, zoomScale: action.payload, isZoomed: action.payload > 1 };
    case "TOGGLE_FULLSCREEN":
      return { ...state, isFullscreen: !state.isFullscreen };
    case "RESET":
      return { ...state, status: "idle", isZoomed: false, zoomScale: 1 };
    default:
      return state;
  }
}

export interface ImageContextValue {
  state: ImageState;
  dispatch: React.Dispatch<ImageAction>;
  setStatus: (s: ImageStatus) => void;
  openLightbox: (index?: number) => void;
  closeLightbox: () => void;
  setLightboxIndex: (i: number) => void;
  toggleZoom: () => void;
  setZoom: (scale: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ImageContext = createContext<ImageContextValue | null>(null);

export interface ImageProviderProps {
  children: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  onLightboxOpen?: () => void;
  onLightboxClose?: () => void;
}

export function ImageProvider({
  children,
  onLoad,
  onError,
  onLightboxOpen,
  onLightboxClose,
}: ImageProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    status: "idle",
    isLightboxOpen: false,
    lightboxIndex: 0,
    isZoomed: false,
    zoomScale: 1,
    isFullscreen: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const setStatus = useCallback((s: ImageStatus) => {
    dispatch({ type: "SET_STATUS", payload: s });
    if (s === "loaded") onLoad?.();
    if (s === "error") onError?.();
  }, [onLoad, onError]);

  const openLightbox = useCallback((index?: number) => {
    dispatch({ type: "OPEN_LIGHTBOX", payload: index });
    onLightboxOpen?.();
  }, [onLightboxOpen]);

  const closeLightbox = useCallback(() => {
    dispatch({ type: "CLOSE_LIGHTBOX" });
    onLightboxClose?.();
  }, [onLightboxClose]);

  const setLightboxIndex = useCallback((i: number) => {
    dispatch({ type: "SET_LIGHTBOX_INDEX", payload: i });
  }, []);

  const toggleZoom = useCallback(() => {
    dispatch({ type: "TOGGLE_ZOOM" });
  }, []);

  const setZoom = useCallback((scale: number) => {
    dispatch({ type: "SET_ZOOM", payload: scale });
  }, []);

  return (
    <ImageContext.Provider value={{
      state, dispatch, setStatus, openLightbox, closeLightbox,
      setLightboxIndex, toggleZoom, setZoom, containerRef,
    }}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImageContext(): ImageContextValue {
  const ctx = useContext(ImageContext);
  if (!ctx) throw new Error("useImageContext must be used within ImageProvider");
  return ctx;
}