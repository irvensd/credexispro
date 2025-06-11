import { useRef, useEffect, useState, useCallback } from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export default function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleItems = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor(scrollTop / itemHeight) + visibleItems + overscan
  );

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const visibleItemsStyle = {
    position: 'absolute' as const,
    top: startIndex * itemHeight,
    left: 0,
    right: 0,
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height, position: 'relative' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={visibleItemsStyle}>
          {items.slice(startIndex, endIndex + 1).map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 