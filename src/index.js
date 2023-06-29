import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import StartRaiting from './StartRaiting';

// function Test() {
//   const [numStarts, setNumStarts] = useState(0);
//   function handlerGetStars(numStarts) {
//     setNumStarts(numStarts);
//   }

//   return (
//     <div>
//       <StartRaiting color="blue" maxRating={10} onNumStarts={handlerGetStars} />
//       <p>This movie was teated {numStarts} starts</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StartRaiting
      maxRating={5}
      messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
    ></StartRaiting>
    <StartRaiting maxRating={10}></StartRaiting>
    <StartRaiting defaultRating={3} size={24} color="tomato"></StartRaiting>
    <Test></Test> */}
  </React.StrictMode>
);
