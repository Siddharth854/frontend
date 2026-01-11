// import React, { useState } from 'react'
// import { timeSlots, days } from './timeSlots'
// import './Calendar.css'   // 🔥 REQUIRED (THIS WAS MISSING)

// const TIME_COL_WIDTH = 80
// const SLOT_HEIGHT = 60

// const CalendarView = ({
//   bookings = [],
//   onBookingClick,
//   onCellSelect,
//   loggedInUserId,
//   onDeleteBooking
// }) => {
//   const [dragStart, setDragStart] = useState(null)
//   const [activeBookingId, setActiveBookingId] = useState(null)

//   const getTop = (time) =>
//     (timeSlots.indexOf(time) + 1) * SLOT_HEIGHT

//   const getHeight = (start, end) =>
//     (timeSlots.indexOf(end) - timeSlots.indexOf(start)) * SLOT_HEIGHT

//   const getDayIndex = (day) =>
//     days.findIndex(d => d.name === day)

//   const handleMouseDown = (day, time) => {
//     setDragStart({ day, time })
//     onCellSelect(day, time, timeSlots[timeSlots.indexOf(time) + 1])
//   }

//   const handleMouseUp = (day, time) => {
//     if (!dragStart) return
//     onCellSelect(dragStart.day, dragStart.time, time)
//     setDragStart(null)
//   }

//   return (
//     <div className="calendar-grid">
//       {/* EMPTY TOP-LEFT CELL */}
//       <div />

//       {/* DAY HEADERS */}
//       {days.map(d => (
//         <div key={d.name} className="day-header">
//           {d.name}
//         </div>
//       ))}

//       {/* TIME LABELS + GRID CELLS */}
//       {timeSlots.map(time => (
//         <React.Fragment key={time}>
//           <div className="time-label">{time}</div>

//           {days.map(d => (
//             <div
//               key={`${d.name}-${time}`}
//               className="cell"
//               onMouseDown={() => handleMouseDown(d.name, time)}
//               onMouseUp={() => handleMouseUp(d.name, time)}
//             />
//           ))}
//         </React.Fragment>
//       ))}

//       {/* BOOKINGS */}
//       {bookings.map(b => {
//         const owner =
//           typeof b.userId === 'object' ? b.userId._id : b.userId
//         const isOwner = String(owner) === String(loggedInUserId)

//         return (
//           <div
//             key={b._id}
//             className="booking"
//             onClick={() => {
//               onBookingClick(b)
//               setActiveBookingId(b._id)
//             }}
//             style={{
//               position: 'absolute',
//               top: getTop(b.startTime),
//               height: getHeight(b.startTime, b.endTime),
//               left: `calc(${TIME_COL_WIDTH}px + (${getDayIndex(b.day)} * ((100% - ${TIME_COL_WIDTH}px) / ${days.length})))`,
//               width: `calc((100% - ${TIME_COL_WIDTH}px) / ${days.length})`
//             }}
//           >
//             <strong>{b.startTime} – {b.endTime}</strong>
//             <div>{b.professor}</div>

//             {isOwner && activeBookingId === b._id && (
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   onDeleteBooking(b._id)
//                 }}
//                 style={{
//                   marginTop: 6,
//                   background: '#e63946',
//                   color: 'white',
//                   border: 'none',
//                   padding: '4px 6px',
//                   fontSize: 11,
//                   borderRadius: 4,
//                   cursor: 'pointer'
//                 }}
//               >
//                 Delete
//               </button>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// export default CalendarView
import React, { useState } from 'react'
import { timeSlots, days } from './timeSlots'
import './Calendar.css'   // ✅ correct CSS

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

  const getTop = (time) =>
    (timeSlots.indexOf(time) + 1) * SLOT_HEIGHT

  const getHeight = (start, end) =>
    (timeSlots.indexOf(end) - timeSlots.indexOf(start)) * SLOT_HEIGHT

  const getDayIndex = (day) =>
    days.findIndex(d => d.name === day)

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

  return (
    <div className="calendar-grid">
      {/* EMPTY CELL (TOP LEFT) */}
      <div />

      {/* DAY HEADERS */}
      {days.map(d => (
        <div key={d.name} className="day-header">
          <div>{d.name}</div>
          {d.date && <small>{d.date}</small>}
        </div>
      ))}

      {/* TIME LABELS + GRID CELLS */}
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
          // 🔒 SAFETY CHECK (VERY IMPORTANT)
          if (
            !timeSlots.includes(b.startTime) ||
            !timeSlots.includes(b.endTime)
          ) return null

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
                top: getTop(b.startTime),
                height: getHeight(b.startTime, b.endTime),
                left: `calc(${TIME_COL_WIDTH}px + (${getDayIndex(b.day)} * ((100% - ${TIME_COL_WIDTH}px) / ${days.length})))`,
                width: `calc((100% - ${TIME_COL_WIDTH}px) / ${days.length})`
              }}
            >
              <strong>{b.startTime} – {b.endTime}</strong>
              <div>{b.professor}</div>

              {/* DELETE (OWNER ONLY) */}
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
