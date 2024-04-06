import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch({ type: 'counter/increment' })}>
        Increment
      </button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'counter/decrement' })}>
        Decrement
      </button>
    </div>
  );
}
