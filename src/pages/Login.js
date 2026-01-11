import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

// 🔥 SIMPLE JWT DECODER (NO LIB NEEDED)
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    return null;
  }
};

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Email and password are required');
    }

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
      });

      const result = await response.json();

      if (!result.success || !result.jwtToken) {
        return handleError(result.message || 'Login failed');
      }

      // 🔥 DECODE JWT TO GET USER INFO (ROOT FIX)
      const decoded = decodeJWT(result.jwtToken);

      if (!decoded || !decoded._id) {
        console.error('JWT DECODE FAILED:', decoded);
        return handleError('Invalid login token');
      }

      // ✅ STORE AUTH DATA
      localStorage.setItem('token', result.jwtToken);
      localStorage.setItem('userId', decoded._id);          // 🔥 FIX
      localStorage.setItem('loggedInUser', decoded.name);   // 🔥 FIX

      console.log('LOGIN STORED:', {
        userId: decoded._id,
        name: decoded.name
      });

      handleSuccess(result.message || 'Login successful');

      setTimeout(() => {
        navigate('/home');
      }, 1000);

    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className='container'>
      <div className="top-title">
        Manipal University Jaipur
      </div>

      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder="Enter your email..."
            value={loginInfo.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginInfo.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>

        <span>
          Don't have an Account?
          <Link to="/signup"> Signup</Link>
        </span>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Login;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import { handleError, handleSuccess } from '../utils';

// function Login() {

//   const [loginInfo, setLoginInfo] = useState({
//     email: '',
//     password: ''
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLoginInfo(prev => ({ ...prev, [name]: value }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { email, password } = loginInfo;

//     if (!email || !password) {
//       return handleError('Email and password are required');
//     }

//     try {
//       const response = await fetch('http://localhost:8080/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(loginInfo)
//       });

//       const result = await response.json();
//       const { success, message, jwtToken, name, _id } = result

// if (success) {
//   handleSuccess(message)
//   localStorage.setItem('token', jwtToken)
//   localStorage.setItem('loggedInUser', name)

//   // 🔥 ADD THIS
//   localStorage.setItem('userId', _id)

//   setTimeout(() => {
//     navigate('/home')
//   }, 1000)
// } else {
//         handleError(message);
//       }

//     } catch (err) {
//       handleError(err.message);
//     }
//   };

//   return (
//     <div className='container'>
//       <div className="top-title">
//         Manipal University Jaipur
//       </div>

//       <h1>Login</h1>

//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Email</label>
//           <input
//             type="text"
//             name="email"
//             placeholder="Enter your email..."
//             value={loginInfo.email}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter your password"
//             value={loginInfo.password}
//             onChange={handleChange}
//           />
//         </div>

//         <button type="submit">Submit</button>

//         <span>
//           Don't have an Account?
//           <Link to="/signup"> Signup</Link>
//         </span>
//       </form>

//       <ToastContainer />
//     </div>
//   );
// }

// export default Login;
