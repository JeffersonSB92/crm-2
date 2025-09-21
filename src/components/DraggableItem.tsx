import { useDraggable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DraggableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function DraggableItem({ id, children, className = "" }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${className} transition-all duration-200 ${isDragging ? 'opacity-80 z-50 shadow-2xl' : 'hover:shadow-lg hover:scale-105'}`}
    >
      {children}
    </div>
  );
}
