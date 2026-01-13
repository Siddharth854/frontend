import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleSuccess } from '../utils'
import CalendarView from './CalendarView'
import './Home.css'

const API_BASE_URL = 'https://conference-web-app.onrender.com'
const API_URL = `${API_BASE_URL}/api/bookings`

const Home = () => {
  const navigate = useNavigate()

  const [loggedInUser, setLoggedInUser] = useState('')
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)

  // /* 🔥 Mobile navbar toggle */
  const [menuOpen, setMenuOpen] = useState(false)

  const loggedInUserId = localStorage.getItem('userId')

  const [formData, setFormData] = useState({
    professor: '',
    department: '',
    school: '',
    room: 'Room 101',
    day: '',
    startTime: '',
    endTime: ''
  })

  /* =======================
     LOAD USER + BOOKINGS
  ======================= */
  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
    fetchBookings()
  }, [])

  /* =======================
     FETCH BOOKINGS
  ======================= */
  const fetchBookings = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await res.json()
      setBookings(Array.isArray(data) ? data : data.bookings || [])
    } catch (err) {
      console.error('Failed to load bookings', err)
      setBookings([])
    }
  }

  /* =======================
     LOGOUT
  ======================= */
  const handleLogout = () => {
    localStorage.clear()
    handleSuccess('User Logged Out')
    setTimeout(() => navigate('/login'), 1000)
  }

  /* =======================
     FORM HANDLING
  ======================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  /* =======================
     GRID CLICK / DRAG  ✅ FIX
  ======================= */
  const handleCellSelect = (day, startTime, endTime) => {
    setFormData(prev => ({
      ...prev,
      day,
      startTime,
      endTime: endTime || prev.endTime,
      room: 'Room 101'
    }))
  }

  /* =======================
     CREATE BOOKING
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.message)
        return
      }

      handleSuccess('Booking Confirmed')
      fetchBookings()

      setFormData({
        professor: '',
        department: '',
        school: '',
        room: 'Room 101',
        day: '',
        startTime: '',
        endTime: ''
      })
    } catch (err) {
      console.error('Booking failed', err)
    }
  }

  /* =======================
     DELETE BOOKING
  ======================= */
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return

    try {
      const res = await fetch(`${API_URL}/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.message)
        return
      }

      handleSuccess('Booking deleted successfully')
      setSelectedBooking(null)
      fetchBookings()
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  /* =======================
     OWNER CHECK
  ======================= */
  const isOwner = (booking) => {
    if (!booking || !loggedInUserId) return false
    const ownerId =
      typeof booking.userId === 'object'
        ? booking.userId._id
        : booking.userId
    return String(ownerId) === String(loggedInUserId)
  }

  return (
    <>
      {/* ================= NAVBAR ================= */}
<div className="navbar">
  {/* Top bar */}
  <div className="navbar-top">
    <button
      className="menu-btn"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      ☰
    </button>

    <div className="nav-title">
      Conference Room Booking
    </div>
  </div>

  {/* Mobile menu (hidden by default) */}
  <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
    <div className="nav-center">
      DEPARTMENT OF COMPUTER APPLICATION
    </div>

    <div className="nav-user">
      Welcome {loggedInUser}
    </div>

    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
</div>


      {/* ================= PAGE CONTENT ================= */}
      <main className="page-content">
        <div className="dashboard">

          {/* BOOKING FORM */}
          <div className="card booking-card">
            <h3>Book Conference Room (101)</h3>

            <form onSubmit={handleSubmit} className="booking-form">
              <input
                name="professor"
                placeholder="Professor Name"
                value={formData.professor}
                onChange={handleChange}
                required
              />

              <input
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required
              />

              <input
                name="school"
                placeholder="School"
                value={formData.school}
                onChange={handleChange}
                required
              />

              <input value="Room 101" disabled />

              <select name="day" value={formData.day} onChange={handleChange} required>
                <option value="">Select Day</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>

              <select name="startTime" value={formData.startTime} onChange={handleChange} required>
                <option value="">Start Time</option>
                <option>08:00</option>
                <option>09:00</option>
                <option>09:50</option>
                <option>10:40</option>
                <option>11:30</option>
                <option>12:20</option>
                <option>14:00</option>
                <option>15:00</option>
                <option>16:00</option>
              </select>

              <select name="endTime" value={formData.endTime} onChange={handleChange} required>
                <option value="">End Time</option>
                <option>09:00</option>
                <option>09:50</option>
                <option>10:40</option>
                <option>11:30</option>
                <option>12:20</option>
                <option>14:00</option>
                <option>15:00</option>
                <option>16:00</option>
                <option>17:00</option>
              </select>

              <button type="submit">Confirm Booking</button>
            </form>
          </div>

          {/* CALENDAR */}
          <div className="card calendar-card">
            <h3>Weekly Schedule</h3>

            <div className="calendar-wrapper">
              <CalendarView
                bookings={bookings}
                onBookingClick={setSelectedBooking}
                onCellSelect={handleCellSelect}
                loggedInUserId={loggedInUserId}
                onDeleteBooking={handleDeleteBooking}
              />
            </div>
          </div>

        </div>
      </main>

      {/* ================= MODAL ================= */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Meeting Details</h3>

            <p><b>Professor:</b> {selectedBooking.professor}</p>
            <p><b>Department:</b> {selectedBooking.department}</p>
            <p><b>School:</b> {selectedBooking.school}</p>
            <p><b>Room:</b> Room 101</p>
            <p><b>Day:</b> {selectedBooking.day}</p>
            <p>
              <b>Time:</b> {selectedBooking.startTime} – {selectedBooking.endTime}
            </p>

            {isOwner(selectedBooking) && (
              <button
                className="delete-btn"
                onClick={() => handleDeleteBooking(selectedBooking._id)}
              >
                Delete Booking
              </button>
            )}

            <button
              onClick={() => setSelectedBooking(null)}
              style={{
                background: '#6a5acd',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Home

// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { handleSuccess } from '../utils'
// import CalendarView from './CalendarView'
// import './Home.css'

// const API_BASE_URL = 'https://conference-web-app.onrender.com'
// const API_URL = `${API_BASE_URL}/api/bookings`

// const Home = () => {
//   const navigate = useNavigate()

//   const [loggedInUser, setLoggedInUser] = useState('')
//   const [bookings, setBookings] = useState([])
//   const [selectedBooking, setSelectedBooking] = useState(null)

//   /* 🔥 Mobile navbar toggle */
//   const [menuOpen, setMenuOpen] = useState(false)

//   const loggedInUserId = localStorage.getItem('userId')

//   const [formData, setFormData] = useState({
//     professor: '',
//     department: '',
//     school: '',
//     room: 'Room 101',
//     day: '',
//     startTime: '',
//     endTime: ''
//   })

//   /* =======================
//      LOAD USER + BOOKINGS
//   ======================= */
//   useEffect(() => {
//     setLoggedInUser(localStorage.getItem('loggedInUser'))
//     fetchBookings()
//   }, [])

//   /* =======================
//      FETCH BOOKINGS
//   ======================= */
//   const fetchBookings = async () => {
//     try {
//       const res = await fetch(API_URL, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       })

//       const data = await res.json()
//       setBookings(Array.isArray(data) ? data : data.bookings || [])
//     } catch (err) {
//       console.error('Failed to load bookings', err)
//       setBookings([])
//     }
//   }

//   /* =======================
//      LOGOUT
//   ======================= */
//   const handleLogout = () => {
//     localStorage.clear()
//     handleSuccess('User Logged Out')
//     setTimeout(() => navigate('/login'), 1000)
//   }

//   /* =======================
//      FORM HANDLING
//   ======================= */
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value })

//   /* =======================
//      GRID CLICK / DRAG  ✅ FIX
//   ======================= */
//   const handleCellSelect = (day, startTime, endTime) => {
//     setFormData(prev => ({
//       ...prev,
//       day,
//       startTime,
//       endTime: endTime || prev.endTime,
//       room: 'Room 101'
//     }))
//   }

//   /* =======================
//      CREATE BOOKING
//   ======================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     try {
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(formData)
//       })

//       const data = await res.json()

//       if (!data.success) {
//         alert(data.message)
//         return
//       }

//       handleSuccess('Booking Confirmed')
//       fetchBookings()

//       setFormData({
//         professor: '',
//         department: '',
//         school: '',
//         room: 'Room 101',
//         day: '',
//         startTime: '',
//         endTime: ''
//       })
//     } catch (err) {
//       console.error('Booking failed', err)
//     }
//   }

//   /* =======================
//      DELETE BOOKING
//   ======================= */
//   const handleDeleteBooking = async (bookingId) => {
//     if (!window.confirm('Are you sure you want to delete this meeting?')) return

//     try {
//       const res = await fetch(`${API_URL}/${bookingId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       })

//       const data = await res.json()

//       if (!data.success) {
//         alert(data.message)
//         return
//       }

//       handleSuccess('Booking deleted successfully')
//       setSelectedBooking(null)
//       fetchBookings()
//     } catch (err) {
//       console.error('Delete failed', err)
//     }
//   }

//   /* =======================
//      OWNER CHECK
//   ======================= */
//   const isOwner = (booking) => {
//     if (!booking || !loggedInUserId) return false
//     const ownerId =
//       typeof booking.userId === 'object'
//         ? booking.userId._id
//         : booking.userId
//     return String(ownerId) === String(loggedInUserId)
//   }

//   return (
//     <>
//       {/* ================= NAVBAR ================= */}
//       <div className={`navbar ${menuOpen ? 'open' : ''}`}>
//         <div className="nav-title">Conference Room Booking System</div>

//         {/* 🔥 MOBILE MENU BUTTON */}
//         <button
//           className="menu-btn"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ☰
//         </button>

//         <div className="nav-center">
//           DEPARTMENT OF COMPUTER APPLICATION
//         </div>

//         <div className="nav-right">
//           <span className="nav-user">Welcome {loggedInUser}</span>
//           <button className="logout-btn" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* ================= PAGE CONTENT ================= */}
//       <main className="page-content">
//         <div className="dashboard">

//           {/* BOOKING FORM */}
//           <div className="card booking-card">
//             <h3>Book Conference Room (101)</h3>

//             <form onSubmit={handleSubmit} className="booking-form">
//               <input
//                 name="professor"
//                 placeholder="Professor Name"
//                 value={formData.professor}
//                 onChange={handleChange}
//                 required
//               />

//               <input
//                 name="department"
//                 placeholder="Department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 required
//               />

//               <input
//                 name="school"
//                 placeholder="School"
//                 value={formData.school}
//                 onChange={handleChange}
//                 required
//               />

//               <input value="Room 101" disabled />

//               <select name="day" value={formData.day} onChange={handleChange} required>
//                 <option value="">Select Day</option>
//                 <option>Monday</option>
//                 <option>Tuesday</option>
//                 <option>Wednesday</option>
//                 <option>Thursday</option>
//                 <option>Friday</option>
//                 <option>Saturday</option>
//                 <option>Sunday</option>
//               </select>

//               <select name="startTime" value={formData.startTime} onChange={handleChange} required>
//                 <option value="">Start Time</option>
//                 <option>08:00</option>
//                 <option>09:00</option>
//                 <option>09:50</option>
//                 <option>10:40</option>
//                 <option>11:30</option>
//                 <option>12:20</option>
//                 <option>14:00</option>
//                 <option>15:00</option>
//                 <option>16:00</option>
//               </select>

//               <select name="endTime" value={formData.endTime} onChange={handleChange} required>
//                 <option value="">End Time</option>
//                 <option>09:00</option>
//                 <option>09:50</option>
//                 <option>10:40</option>
//                 <option>11:30</option>
//                 <option>12:20</option>
//                 <option>14:00</option>
//                 <option>15:00</option>
//                 <option>16:00</option>
//                 <option>17:00</option>
//               </select>

//               <button type="submit">Confirm Booking</button>
//             </form>
//           </div>

//           {/* CALENDAR */}
//           <div className="card calendar-card">
//             <h3>Weekly Schedule</h3>

//             <div className="calendar-wrapper">
//               <CalendarView
//                 bookings={bookings}
//                 onBookingClick={setSelectedBooking}
//                 onCellSelect={handleCellSelect}
//                 loggedInUserId={loggedInUserId}
//                 onDeleteBooking={handleDeleteBooking}
//               />
//             </div>
//           </div>

//         </div>
//       </main>

//       {/* ================= MODAL ================= */}
//       {selectedBooking && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Meeting Details</h3>

//             <p><b>Professor:</b> {selectedBooking.professor}</p>
//             <p><b>Department:</b> {selectedBooking.department}</p>
//             <p><b>School:</b> {selectedBooking.school}</p>
//             <p><b>Room:</b> Room 101</p>
//             <p><b>Day:</b> {selectedBooking.day}</p>
//             <p>
//               <b>Time:</b> {selectedBooking.startTime} – {selectedBooking.endTime}
//             </p>

//             {isOwner(selectedBooking) && (
//               <button
//                 className="delete-btn"
//                 onClick={() => handleDeleteBooking(selectedBooking._id)}
//               >
//                 Delete Booking
//               </button>
//             )}

//             <button
//               onClick={() => setSelectedBooking(null)}
//               style={{
//                 background: '#6a5acd',
//                 color: 'white',
//                 padding: '8px 14px',
//                 borderRadius: '6px',
//                 border: 'none',
//                 cursor: 'pointer'
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default Home
