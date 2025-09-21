import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableAreaProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function DroppableArea({ id, children, className = "" }: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} transition-all duration-200 ${isOver ? 'bg-blue-500/10 border-2 border-blue-400 border-dashed' : ''}`}
    >
      {children}
    </div>
  );
}
