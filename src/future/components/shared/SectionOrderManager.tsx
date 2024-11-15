/**
 * @fileoverview Future implementation of generic section order manager component
 * TODO: This is a planned implementation - NOT CURRENTLY IN USE
 * Will be integrated when generic section ordering is needed across multiple views
 */

import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Settings, GripVertical } from 'lucide-react';

interface SectionOrderManagerProps<T> {
  sectionOrder: T[];
  sectionTitles: Record<T, string>;
  onMove: (fromIndex: number, toIndex: number) => void;
  onReset: () => void;
  title?: string;
}

export const SectionOrderManager = <T extends string>({
  sectionOrder,
  sectionTitles,
  onMove,
  onReset,
  title = "Section Order"
}: SectionOrderManagerProps<T>) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onMove(result.source.index, result.destination.index);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset to Default
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {sectionOrder.map((section, index) => (
                <Draggable
                  key={section}
                  draggableId={section}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span>{sectionTitles[section]}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};