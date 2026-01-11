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

  /* LOAD USER + BOOKINGS */
  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
    fetchBookings()
  }, [])

  /* FETCH BOOKINGS */
  const fetchBookings = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : data.bookings || [])
    } catch {
      setBookings([])
    }
  }

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.clear()
    handleSuccess('User Logged Out')
    setTimeout(() => navigate('/login'), 1000)
  }

  /* FORM */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  /* CREATE BOOKING */
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
      if (!data.success) return alert(data.message)

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
    } catch {}
  }

  /* DELETE BOOKING */
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    handleSuccess('Booking deleted')
    setSelectedBooking(null)
    fetchBookings()
  }

  const isOwner = (b) => {
    const owner = typeof b.userId === 'object' ? b.userId._id : b.userId
    return String(owner) === String(loggedInUserId)
  }

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-title">Conference Room Booking System</div>
        <div className="nav-center">DEPARTMENT OF COMPUTER APPLICATION</div>
        <div className="nav-right">
          <span className="nav-user">Welcome {loggedInUser}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <main className="page-content">
        <div className="dashboard">

          {/* FORM */}
          <div className="card booking-card">
            <h3>Book Conference Room (101)</h3>
            <form onSubmit={handleSubmit} className="booking-form">
              <input name="professor" placeholder="Professor" value={formData.professor} onChange={handleChange} required />
              <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
              <input name="school" placeholder="School" value={formData.school} onChange={handleChange} required />
              <input value="Room 101" disabled />

              <select name="day" value={formData.day} onChange={handleChange} required>
                <option value="">Select Day</option>
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <select name="startTime" value={formData.startTime} onChange={handleChange} required>
                <option value="">Start Time</option>
                {['08:00','09:00','09:50','10:40','11:30','12:20','14:00','15:00','16:00'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <select name="endTime" value={formData.endTime} onChange={handleChange} required>
                <option value="">End Time</option>
                {['09:00','09:50','10:40','11:30','12:20','14:00','15:00','16:00','17:00'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <button type="submit">Confirm Booking</button>
            </form>
          </div>

          {/* CALENDAR */}
          <div className="card calendar-card">
                    <h3>Weekly Schedule</h3>
                    <CalendarView
                      bookings={bookings}
                      onBookingClick={setSelectedBooking}
                      onCellSelect={handleCellSelect}
                      loggedInUserId={loggedInUserId}
                      onDeleteBooking={handleDeleteBooking}
                    />
          </div>
        </div>
      </main>

      {/* MODAL */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Meeting Details</h3>
            <p><b>Professor:</b> {selectedBooking.professor}</p>
            <p><b>Day:</b> {selectedBooking.day}</p>
            <p><b>Time:</b> {selectedBooking.startTime} – {selectedBooking.endTime}</p>

            {isOwner(selectedBooking) && (
              <button className="delete-btn" onClick={() => handleDeleteBooking(selectedBooking._id)}>
                Delete Booking
              </button>
            )}

            <button onClick={() => setSelectedBooking(null)}>Close</button>
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
// const API_BASE_URL = "https://conference-web-app.onrender.com";

// const API_URL = `${API_BASE_URL}/api/bookings`

// //const API_URL = 'http://localhost:8080/api/bookings'

// const Home = () => {
//   const navigate = useNavigate()

//   const [loggedInUser, setLoggedInUser] = useState('')
//   const [bookings, setBookings] = useState([])
//   const [selectedBooking, setSelectedBooking] = useState(null)

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
//     // ✅ FIX: correct key for username
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

//       if (Array.isArray(data)) {
//         setBookings(data)
//       } else if (Array.isArray(data.bookings)) {
//         setBookings(data.bookings)
//       } else {
//         console.error('Unexpected bookings response:', data)
//         setBookings([])
//       }
//     } catch (err) {
//       console.error('Failed to load bookings', err)
//       setBookings([])
//     }
//   }

//   /* =======================
//      LOGOUT
//   ======================= */
//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('userId')
//     localStorage.removeItem('loggedInUser')
//     handleSuccess('User Logged Out')
//     setTimeout(() => navigate('/login'), 1000)
//   }

//   /* =======================
//      FORM HANDLING
//   ======================= */
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
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
//      GRID CLICK / DRAG
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
//      OWNER CHECK (SAFE)
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
//       {/* NAVBAR */}
//       <div className="navbar">
//         <div className="nav-title">Conference Room Booking System</div>
//         <div className="nav-center">DEPARTMENT OF COMPUTER APPLICATION</div>
//         <div className="nav-right">
//           <span className="nav-user">Welcome :    {loggedInUser}</span>
//           <button className="logout-btn" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* PAGE CONTENT */}
//       <main className="page-content">
//         <div className="dashboard">

//           {/* BOOKING FORM */}
//           <div className="card booking-card">
//             <h3>Book Conference Room (101)</h3>

//             <form onSubmit={handleSubmit} className="booking-form">
//               <input name="professor" placeholder="Professor Name"
//                 value={formData.professor} onChange={handleChange} required />

//               <input name="department" placeholder="Department"
//                 value={formData.department} onChange={handleChange} required />

//               <input name="school" placeholder="School"
//                 value={formData.school} onChange={handleChange} required />

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
//             <CalendarView
//               bookings={bookings}
//               onBookingClick={setSelectedBooking}
//               onCellSelect={handleCellSelect}
//             />
//           </div>

//         </div>
//       </main>

//       {/* BOOKING DETAILS MODAL */}
//       {selectedBooking && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Meeting Details</h3>

//             <p><b>Professor:</b> {selectedBooking.professor}</p>
//             <p><b>Department:</b> {selectedBooking.department}</p>
//             <p><b>School:</b> {selectedBooking.school}</p>
//             <p><b>Room:</b> Room 101</p>
//             <p><b>Day:</b> {selectedBooking.day}</p>
//             <p><b>Time:</b> {selectedBooking.startTime} – {selectedBooking.endTime}</p>

//             {/* DELETE BUTTON — OWNER ONLY */}
//             {isOwner(selectedBooking) && (
//               <button
//                 onClick={() => handleDeleteBooking(selectedBooking._id)}
//                 style={{
//                   background: '#e63946',
//                   color: 'white',
//                   marginRight: '12px',
//                   padding: '8px 14px',
//                   borderRadius: '6px',
//                   border: 'none',
//                   cursor: 'pointer'
//                 }}
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
