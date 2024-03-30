import React, { useRef, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error(error);
      setError(`Failed to create an account: ${error.message}`);
    }

    setLoading(false);
  }
  return (
    <div>
      <h2>Sign Up</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Updated for correct HTML element */}
      <form onSubmit={handleSubmit}>
        <input type="email" ref={emailRef} required placeholder="Email" />
        <input type="password" ref={passwordRef} required placeholder="Password" />
        <button disabled={loading} type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
