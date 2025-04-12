// data/questions.js
export const questions = [
  {
    id: 1,
    type: 'mcq',
    category: 'aptitude',
    question: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
    options: [
      { value: '120 meters', label: '120 meters' },
      { value: '150 meters', label: '150 meters' },
      { value: '180 meters', label: '180 meters' },
      { value: '200 meters', label: '200 meters' }
    ],
    correctAnswer: '150 meters',
    explanation: 'Speed = 60 km/hr = 60 * (5/18) = 50/3 m/s. Time = 9 seconds. Length = Speed * Time = (50/3) * 9 = 150 meters.'
  },
  {
    id: 2,
    type: 'mcq',
    category: 'aptitude',
    question: 'If a person walks at 14 km/hr instead of 10 km/hr, he would have walked 20 km more. The actual distance traveled by him is:',
    options: [
      { value: '50 km', label: '50 km' },
      { value: '56 km', label: '56 km' },
      { value: '70 km', label: '70 km' },
      { value: '80 km', label: '80 km' }
    ],
    correctAnswer: '50 km',
    explanation: 'Let time = t hours. Distance at 10 km/hr = 10t. At 14 km/hr, distance = 14t = 10t + 20. Thus, 4t = 20, t = 5. Actual distance = 10t = 10 * 5 = 50 km.'
  },
  {
    id: 3,
    type: 'mcq',
    category: 'reasoning',
    question: 'Complete the series: 3, 6, 11, 18, 27, ?',
    options: [
      { value: '36', label: '36' },
      { value: '38', label: '38' },
      { value: '40', label: '40' },
      { value: '42', label: '42' }
    ],
    correctAnswer: '38',
    explanation: 'The series follows a pattern where differences increase by 2: 3 (+3) 6 (+5) 11 (+7) 18 (+9) 27 (+11) ?. Next difference is 11, so 27 + 11 = 38.'
  },
  {
    id: 4,
    type: 'mcq',
    category: 'reasoning',
    question: 'In a certain code, COMPUTER is written as RFUVQNPC. How will MEDICINE be written in the same code?',
    options: [
      { value: 'EOJDJEFM', label: 'EOJDJEFM' },
      { value: 'MFEJDJOF', label: 'MFEJDJOF' },
      { value: 'ENICIDME', label: 'ENICIDME' },
      { value: 'MFEJEOJF', label: 'MFEJEOJF' }
    ],
    correctAnswer: 'MFEJEOJF',
    explanation: 'Each letter in COMPUTER is shifted to its next letter (C→R, O→F, etc., with Z wrapping to A), and the resulting string is reversed. For MEDICINE: M→N, E→F, D→E, I→J, C→D, I→J, N→O, E→F gives NFJEJDOF, reversed is MFEJEOJF.'
  },
  {
    id: 5,
    type: 'short',
    category: 'verbal',
    question: 'What is the antonym of FRUGAL?',
    correctAnswer: 'extravagant',
    explanation: 'Frugal means economical or avoiding waste, so its antonym is extravagant, meaning wasteful or lavish.'
  }
];

export default questions;