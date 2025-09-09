"use client"

import React from "react"
import EventItem from "../eventItems/page"
import { EventActivityType, EventActionType, EventType } from "@/constants/event"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { useEvents } from "@/context/EventContext"

type EventListProps = {
  events: EventType[] // ✅ use EventType instead of redefining
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const { dispatch } = useEvents()

  if (events.length === 0) {
    return <p className="text-gray-500">No events planned this weekend 🎉</p>
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reordered = Array.from(events)
    const [movedItem] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, movedItem)

    dispatch({
      type: EventActionType.UPDATE_ORDER,
      payload: reordered,
    })
  }

  return (
    <div className="md:max-h-[100vh] max-h-[50vh] overflow-y-auto pr-2">

    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="event-list">
        {(provided) => (
          <div
            className="grid gap-3"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {events.map((event, index) => (
              <Draggable key={event.id} draggableId={event.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`rounded transition  ${
                      snapshot.isDragging ? "bg-blue-50 shadow-lg" : ""
                    }`}
                  >
                    <EventItem
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      eventType={event.activity}
                      mood={event.mood}
                      theme={event.theme}
                      end={event.end}
                      eventId={event.eventId}
                    />
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
  )
}

export default EventList
