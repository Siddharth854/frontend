// import React, { useState } from 'react'
// import { timeSlots, days } from './timeSlots'

// const TIME_COL_WIDTH = 90
// const SLOT_HEIGHT = 60

// // 🔥 NEW PROPS ADDED (loggedInUserId, onDeleteBooking)
// const CalendarView = ({
//   bookings,
//   onBookingClick,
//   onCellSelect,
//   loggedInUserId,
//   onDeleteBooking
// }) => {
//   const [dragStart, setDragStart] = useState(null)

//   // 🔥 NEW STATE (controls which booking shows delete)
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
//         <div
//           key={d.name}
//           style={{
//             background: '#6a5acd',
//             color: 'white',
//             textAlign: 'center',
//             padding: 6
//           }}
//         >
//           <div>{d.name}</div>
//           <small>{d.date}</small>
//         </div>
//       ))}

//       {timeSlots.map(time => (
//         <React.Fragment key={time}>
//           <div style={{ borderRight: '1px solid #ccc', paddingLeft: 8 }}>
//             {time}
//           </div>

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

//       {/* ======================
//            BOOKINGS (UNCHANGED + DELETE)
//          ====================== */}
//       {bookings.map((b, i) => {
//         const isOwner =
//           String(b.userId) === String(loggedInUserId)

//         return (
//           <div
//             key={b._id || i}
//             onClick={() => {
//               onBookingClick(b)
//               setActiveBookingId(b._id) // 🔥 NEW
//             }}
//             style={{
//               position: 'absolute',
//               top: getTop(b.startTime),
//               height: getHeight(b.startTime, b.endTime),
//               left: `calc(${TIME_COL_WIDTH}px + (${getDayIndex(b.day)} * ((100% - ${TIME_COL_WIDTH}px) / ${days.length})))`,
//               width: `calc((100% - ${TIME_COL_WIDTH}px) / ${days.length})`,
//               background: '#4caf50',
//               color: 'white',
//               padding: 8,
//               borderRadius: 6,
//               fontSize: 12,
//               cursor: 'pointer'
//             }}
//           >
//             <strong>{b.startTime} – {b.endTime}</strong>
//             <div>{b.professor}</div>

//             {/* 🔥 DELETE BUTTON (ONLY OWNER + ON CLICK) */}
//             {isOwner && activeBookingId === b._id && (
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation() // 🔥 prevent slot click
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


import React from 'react'
import { timeSlots, days } from './timeSlots'

const TIME_COL_WIDTH = 90
const SLOT_HEIGHT = 60

const CalendarView = ({
  bookings = [],
  onBookingClick,
  onDeleteBooking,
  loggedInUserId
}) => {
  const isMobile = window.innerWidth < 768

  /* =====================
     MOBILE VIEW (LIST)
  ===================== */
  if (isMobile) {
    return (
      <div style={{ padding: 12 }}>
        {bookings.length === 0 && <p>No bookings</p>}

        {bookings.map(b => {
          const owner =
            typeof b.userId === 'object' ? b.userId._id : b.userId
          const isOwner = String(owner) === String(loggedInUserId)

          return (
            <div
              key={b._id}
              onClick={() => onBookingClick(b)}
              style={{
                background: '#457b9d',
                color: 'white',
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
                cursor: 'pointer'
              }}
            >
              <strong>{b.day}</strong>
              <div>{b.startTime} – {b.endTime}</div>
              <div>{b.professor}</div>

              {isOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteBooking(b._id)
                  }}
                  style={{
                    marginTop: 8,
                    background: '#e63946',
                    border: 'none',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: 6,
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

  /* =====================
     DESKTOP VIEW (GRID)
  ===================== */
  const getTop = (time) =>
    (timeSlots.indexOf(time) + 1) * SLOT_HEIGHT

  const getHeight = (start, end) =>
    (timeSlots.indexOf(end) - timeSlots.indexOf(start)) * SLOT_HEIGHT

  const getDayIndex = (day) =>
    days.findIndex(d => d.name === day)

  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${days.length}, 1fr)`,
        gridAutoRows: `${SLOT_HEIGHT}px`,
        width: '100%',
        height: `${(timeSlots.length + 1) * SLOT_HEIGHT}px`, // 🔥 FIX
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
          style={{
            background: '#6a5acd',
            color: 'white',
            textAlign: 'center',
            padding: 6,
            fontWeight: 600
          }}
        >
          {d.name}
        </div>
      ))}

      {/* Time labels + cells */}
      {timeSlots.map(time => (
        <React.Fragment key={time}>
          <div
            style={{
              borderRight: '1px solid #ccc',
              paddingLeft: 8,
              fontSize: 12
            }}
          >
            {time}
          </div>

          {days.map(d => (
            <div
              key={`${d.name}-${time}`}
              style={{ border: '1px solid #eee' }}
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
            onClick={() => onBookingClick(b)}
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
            <strong>
              {b.startTime} – {b.endTime}
            </strong>
            <div>{b.professor}</div>

            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteBooking(b._id)
                }}
                style={{
                  marginTop: 6,
                  background: '#e63946',
                  border: 'none',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11,
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
