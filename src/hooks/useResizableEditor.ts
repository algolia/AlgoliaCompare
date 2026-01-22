import { useState, useRef } from 'react';

/**
 * Custom hook for managing resizable editor height via mouse drag.
 * Provides both the current height and a mouse down handler for drag-to-resize functionality.
 *
 * @param initialHeight - Starting height in pixels (default: 200)
 * @param minHeight - Minimum allowed height in pixels (default: 100)
 * @param maxHeight - Maximum allowed height in pixels (default: 800)
 * @returns Object containing current height and handleMouseDown function
 *
 * @example
 * ```tsx
 * const { height, handleMouseDown } = useResizableEditor(250);
 *
 * return (
 *   <div>
 *     <Editor height={`${height}px`} />
 *     <div onMouseDown={handleMouseDown} className="resize-handle" />
 *   </div>
 * );
 * ```
 */
export function useResizableEditor(
  initialHeight: number = 200,
  minHeight: number = 100,
  maxHeight: number = 800
) {
  const [height, setHeight] = useState(initialHeight);
  const resizeRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = height;
    resizeRef.current = { startY, startHeight };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeRef.current) return;
      const deltaY = moveEvent.clientY - resizeRef.current.startY;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeRef.current.startHeight + deltaY));
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      resizeRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { height, handleMouseDown };
}
