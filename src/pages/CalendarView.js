import React, { useState } from 'react'
import { timeSlots, days } from './timeSlots'
import './Calendar.css'

const TIME_COL_WIDTH = 80
const SLOT_HEIGHT = 60

const CalendarView = ({
  bookings = [],
  onBookingClick,
  onCellSelect,
  loggedInUserId,
  onDeleteBooking
}) => {
  const [dragStart, setDragStart] = useState(null)
  const [activeBookingId, setActiveBookingId] = useState(null)

  /* =========================
     POSITION CALCULATIONS
  ========================= */
  const getTop = (time) =>
    (timeSlots.indexOf(time) + 1) * SLOT_HEIGHT

  const getHeight = (start, end) =>
    (timeSlots.indexOf(end) - timeSlots.indexOf(start)) * SLOT_HEIGHT

  const getDayIndex = (day) =>
    days.findIndex(d => d.name === day)

  /* =========================
     DRAG SELECTION
  ========================= */
  const handleMouseDown = (day, time) => {
    const nextSlot = timeSlots[timeSlots.indexOf(time) + 1]
    if (!nextSlot) return

    setDragStart({ day, time })
    onCellSelect(day, time, nextSlot)
  }

  const handleMouseUp = (day, time) => {
    if (!dragStart) return
    onCellSelect(dragStart.day, dragStart.time, time)
    setDragStart(null)
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="calendar-wrapper">
      <div className="calendar-grid">

        {/* TOP-LEFT EMPTY CELL */}
        <div />

        {/* DAY HEADERS */}
        {days.map(d => (
          <div key={d.name} className="day-header">
            <div>{d.name}</div>
            {d.date && <small>{d.date}</small>}
          </div>
        ))}

        {/* TIME LABELS + CELLS */}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            <div className="time-label">{time}</div>

            {days.map(d => (
              <div
                key={`${d.name}-${time}`}
                className="cell"
                onMouseDown={() => handleMouseDown(d.name, time)}
                onMouseUp={() => handleMouseUp(d.name, time)}
              />
            ))}
          </React.Fragment>
        ))}

        {/* BOOKINGS */}
        {Array.isArray(bookings) &&
          bookings.map(b => {
            // Safety check (prevents invisible bookings)
            if (
              !timeSlots.includes(b.startTime) ||
              !timeSlots.includes(b.endTime)
            ) return null

            const ownerId =
              typeof b.userId === 'object' ? b.userId._id : b.userId

            const isOwner = String(ownerId) === String(loggedInUserId)

            return (
              <div
                key={b._id}
                className="booking"
                style={{
                  top: getTop(b.startTime),
                  height: getHeight(b.startTime, b.endTime),
                  left: `calc(${TIME_COL_WIDTH}px + (${getDayIndex(b.day)} * ((100% - ${TIME_COL_WIDTH}px) / ${days.length})))`,
                  width: `calc((100% - ${TIME_COL_WIDTH}px) / ${days.length})`
                }}
                onClick={() => {
                  onBookingClick(b)
                  setActiveBookingId(b._id)
                }}
              >
                <strong>{b.startTime} – {b.endTime}</strong>
                <div>{b.professor}</div>

                {/* DELETE (OWNER ONLY) */}
                {isOwner && activeBookingId === b._id && (
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteBooking(b._id)
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CalendarView
