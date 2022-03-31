import React from 'react';
//import './App.css';

export default (props) => {
  return (

    <div className="text-box fade-in">
      <h2 className="summary">Summary</h2>
      <h5 className='text-area'>{props.summary}</h5>
    </div>

  );
}

