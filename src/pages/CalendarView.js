import React, { useState } from 'react'
import { timeSlots, days } from './timeSlots'

const TIME_COL_WIDTH = 90
const SLOT_HEIGHT = 60

// 🔥 NEW PROPS ADDED (loggedInUserId, onDeleteBooking)
const CalendarView = ({
  bookings,
  onBookingClick,
  onCellSelect,
  loggedInUserId,
  onDeleteBooking
}) => {
  const [dragStart, setDragStart] = useState(null)

  // 🔥 NEW STATE (controls which booking shows delete)
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
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${days.length}, 1fr)`,
        gridAutoRows: `${SLOT_HEIGHT}px`,
        width: '100%',
        border: '1px solid #ccc'
      }}
    >
      <div />

      {days.map(d => (
        <div
          key={d.name}
          style={{
            background: '#6a5acd',
            color: 'white',
            textAlign: 'center',
            padding: 6
          }}
        >
          <div>{d.name}</div>
          <small>{d.date}</small>
        </div>
      ))}

      {timeSlots.map(time => (
        <React.Fragment key={time}>
          <div style={{ borderRight: '1px solid #ccc', paddingLeft: 8 }}>
            {time}
          </div>

          {days.map(d => (
            <div
              key={`${d.name}-${time}`}
              style={{ border: '1px solid #eee', cursor: 'pointer' }}
              onMouseDown={() => handleMouseDown(d.name, time)}
              onMouseUp={() => handleMouseUp(d.name, time)}
            />
          ))}
        </React.Fragment>
      ))}

      {/* ======================
           BOOKINGS (UNCHANGED + DELETE)
         ====================== */}
      {bookings.map((b, i) => {
        const isOwner =
          String(b.userId) === String(loggedInUserId)

        return (
          <div
            key={b._id || i}
            onClick={() => {
              onBookingClick(b)
              setActiveBookingId(b._id) // 🔥 NEW
            }}
            style={{
              position: 'absolute',
              top: getTop(b.startTime),
              height: getHeight(b.startTime, b.endTime),
              left: `calc(${TIME_COL_WIDTH}px + (${getDayIndex(b.day)} * ((100% - ${TIME_COL_WIDTH}px) / ${days.length})))`,
              width: `calc((100% - ${TIME_COL_WIDTH}px) / ${days.length})`,
              background: '#4caf50',
              color: 'white',
              padding: 8,
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            <strong>{b.startTime} – {b.endTime}</strong>
            <div>{b.professor}</div>

            {/* 🔥 DELETE BUTTON (ONLY OWNER + ON CLICK) */}
            {isOwner && activeBookingId === b._id && (
              <button
                onClick={(e) => {
                  e.stopPropagation() // 🔥 prevent slot click
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

// import React, { useState } from 'react'
// import { timeSlots, days } from './timeSlots'

// const TIME_COL_WIDTH = 90
// const SLOT_HEIGHT = 60

// const CalendarView = ({ bookings, onBookingClick, onCellSelect }) => {
//   const [dragStart, setDragStart] = useState(null)

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
//     <div
//       style={{
//         position: 'relative',
//         display: 'grid',
//         gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${days.length}, 1fr)`,
//         gridAutoRows: `${SLOT_HEIGHT}px`,
//         width: '100%',
//         border: '1px solid #ccc'
//       }}
//     >
//       <div />

//       {days.map(d => (
//         <div key={d.name} style={{ background: '#6a5acd', color: 'white', textAlign: 'center', padding: 6 }}>
//           <div>{d.name}</div>
//           <small>{d.date}</small>
//         </div>
//       ))}

//       {timeSlots.map(time => (
//         <React.Fragment key={time}>
//           <div style={{ borderRight: '1px solid #ccc', paddingLeft: 8 }}>{time}</div>

//           {days.map(d => (
//             <div
//               key={`${d.name}-${time}`}
//               style={{ border: '1px solid #eee', cursor: 'pointer' }}
//               onMouseDown={() => handleMouseDown(d.name, time)}
//               onMouseUp={() => handleMouseUp(d.name, time)}
//             />
//           ))}
//         </React.Fragment>
//       ))}

//       {bookings.map((b, i) => (
//         <div
//           key={i}
//           onClick={() => onBookingClick(b)}
//           style={{
//             position: 'absolute',
//             top: getTop(b.startTime),
//             height: getHeight(b.startTime, b.endTime),
//             left: `calc(${TIME_COL_WIDTH}px + (${getDayIndex(b.day)} * ((100% - ${TIME_COL_WIDTH}px) / ${days.length})))`,
//             width: `calc((100% - ${TIME_COL_WIDTH}px) / ${days.length})`,
//             background: '#4caf50',
//             color: 'white',
//             padding: 8,
//             borderRadius: 6,
//             fontSize: 12,
//             cursor: 'pointer'
//           }}
//         >
//           <strong>{b.startTime} – {b.endTime}</strong>
//           <div>{b.professor}</div>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default CalendarView

