import React, { useState } from 'react'
import { timeSlots, days } from './timeSlots'

const TIME_COL_WIDTH = 90
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

  const getTop = (time) =>
    (timeSlots.indexOf(time) + 1) * SLOT_HEIGHT

  const getHeight = (start, end) =>
    (timeSlots.indexOf(end) - timeSlots.indexOf(start)) * SLOT_HEIGHT

  const getDayIndex = (day) =>
    days.findIndex(d => d.name === day)

  const handleMouseDown = (day, time) => {
    setDragStart({ day, time })
    onCellSelect(day, time, timeSlots[timeSlots.indexOf(time) + 1])
  }

  const handleMouseUp = (day, time) => {
    if (!dragStart) return
    onCellSelect(dragStart.day, dragStart.time, time)
    setDragStart(null)
  }

  return (
    <div
      className="calendar-grid"   {/* 🔥 THIS IS THE KEY FIX */}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${days.length}, 1fr)`,
        gridAutoRows: `${SLOT_HEIGHT}px`,
        width: '100%',
        height: `${(timeSlots.length + 1) * SLOT_HEIGHT}px`,
        minHeight: '720px',
        border: '1px solid #ccc',
        background: '#fff'
      }}
    >
      {/* Empty corner */}
      <div />

      {/* Day headers */}
      {days.map(d => (
        <div
          key={d.name}
          className="day-header"
        >
          <div>{d.name}</div>
          <small>{d.date}</small>
        </div>
      ))}

      {/* Time labels + grid cells */}
      {timeSlots.map(time => (
        <React.Fragment key={time}>
          <div className="time-label">
            {time}
          </div>

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
      {bookings.map(b => {
        const owner =
          typeof b.userId === 'object' ? b.userId._id : b.userId
        const isOwner = String(owner) === String(loggedInUserId)

        return (
          <div
            key={b._id}
            className="booking"
            onClick={() => {
              onBookingClick(b)
              setActiveBookingId(b._id)
            }}
            style={{
              position: 'absolute',
              top: getTop(b.startTime),
              height: getHeight(b.startTime, b.endTime),
              left: `calc(${TIME_COL_WIDTH}px + (${getDayIndex(b.day)} * ((100% - ${TIME_COL_WIDTH}px) / ${days.length})))`,
              width: `calc((100% - ${TIME_COL_WIDTH}px) / ${days.length})`,
              cursor: 'pointer'
            }}
          >
            <strong>{b.startTime} – {b.endTime}</strong>
            <div>{b.professor}</div>

            {isOwner && activeBookingId === b._id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteBooking(b._id)
                }}
                style={{
                  marginTop: 6,
                  background: '#e63946',
                  color: 'white',
                  border: 'none',
                  padding: '4px 6px',
                  fontSize: 11,
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CalendarView
