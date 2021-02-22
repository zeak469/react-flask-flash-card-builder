import { act } from '@testing-library/react';
import React, { useState, useEffect, useReducer } from 'react';
import './App.css';



  
const reducer = (state, action) => {
  switch (action.type) {
    case "on":
      const newSelectedValues = [...state.selectedValues]
      newSelectedValues[action.payload] = !state.selectedValues[action.payload]
      const newState = {...state, selectedValues: newSelectedValues}
      return newState
    default:
      return newState
  }
}

function FlashCard({switchOn, question, answers, flashCardNumber, setUserAnswer}) {

  const handleChangeTextArea = (event) =>{
    setUserAnswer(event.target.value)
  }

  const handleChangeCheckBox = (i) => {
    switchOn(i)
  }

  const answersComponents = answers.map((ans, i) => {
    return (
      <div key={`${i}`}>
        <input type="checkbox" value={i} onChange={() => handleChangeCheckBox(i)} />
        <label key={i}>{ans}</label>    
      </div>
    )

  })
  
  if (answers[flashCardNumber] !== "") {
    return (
      <>
        {question}
        {answersComponents}
      </>
    )
  }
  else{
    return (
      <>
        {question}
        <input type="textarea" id="fname" name="fname" onChange={handleChangeTextArea}/>
      </>
    )
  }
}

function ShowFlashCards(switchOn, data, flashCardNumber, setUserAnswer){
  if (data && data.length > flashCardNumber){
    return (<FlashCard 
    switchOn={switchOn}
    flashCardNumber={flashCardNumber} 
    question={data[flashCardNumber].question} 
    answers={data[flashCardNumber].answers}
    setUserAnswer={setUserAnswer} /> );
  }
  else{
    return <em>"Done!"</em>
  }
}


function FlashCardPage({switchOn, data, flashCardNumber, next, setUserAnswer}){
  return (
    <>
    {ShowFlashCards(switchOn, data, flashCardNumber, setUserAnswer)}
    {data && flashCardNumber < data.length ? <button onClick={next}>Next</button> : null}
    </>
  )
}

function Page({switchOn, data, flashCardNumber, nextFlashCard, setUserAnswer, isCorrect, isAnswer}){
  if (!isAnswer){
    return (
      <div className="App">
          <header className="App-header">
          <FlashCardPage switchOn={switchOn} data={data} flashCardNumber={flashCardNumber} next={nextFlashCard} setUserAnswer={setUserAnswer}/>
          </header>
      </div>
    );
  }
  else{
    if (isCorrect){
      return (
        <div className="App">
            <header className="App-header" style={{backgroundColor: "green"}}>
              {"Correct"}
              {<button onClick={nextFlashCard}>Next</button>}
            </header>
        </div>
      )
    }
    else{
      return (
        <div className="App">
            <header className="App-header" style={{backgroundColor: "#ff6666"}}>
              {"Incorrect"}
              {<button onClick={nextFlashCard}>Next</button>}
            </header>
        </div>
      )
    }
  }
}

const searchState = {
  SEARCH_FOR_ANSWER_IN: 0,
  SEARCH_FOR_ANSWER_NOT_IN: 1,
  SEARCH_NEXT: 2,
  INCORRECT_ANSWER: 3
}

function App() {
  const initialState = {
    selectedValues: [false, false, false, false]
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  function switchOn(i){
    dispatch({type: 'on', payload: i})
  }

  const [flashCardNumber, setFlashCardNumber] = useState(0)
  const [data, setData] = useState();
  const [isAnswer, setAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)


  const nextFlashCard = () => {
    if (flashCardNumber >= data.length){
      isAnswer ? setAnswer(false) : setAnswer(true)
      return
    } 
    if (isAnswer){
      setAnswer(false)
      return
    }
    else{
      setAnswer(true)
    }
    setFlashCardNumber(flashCardNumber + 1)
    if (data[flashCardNumber].answers[0].length == 0){
      if (data[flashCardNumber].right_answer === userAnswer){
        setIsCorrect(true)
      }
      else{
        setIsCorrect(false)
      }
    }
    else{
      const correctAnswers = data[flashCardNumber].right_answer.split(",")
      var currentSearchState
      var i = 0
      state.selectedValues[i] ? currentSearchState = searchState.SEARCH_FOR_ANSWER_IN : currentSearchState = searchState.SEARCH_FOR_ANSWER_NOT_IN
      while (i < state.selectedValues.length) {
        switch(currentSearchState){
          case searchState.SEARCH_FOR_ANSWER_IN:
            correctAnswers.find(element => parseInt(element) === i + 1) ? currentSearchState = searchState.SEARCH_NEXT : currentSearchState = searchState.INCORRECT_ANSWER
            break
          case searchState.SEARCH_FOR_ANSWER_NOT_IN:
            correctAnswers.find(element => parseInt(element) === i + 1) ? currentSearchState = searchState.INCORRECT_ANSWER : currentSearchState = searchState.SEARCH_NEXT
            break
          case searchState.SEARCH_NEXT:
            i += 1
            state.selectedValues[i] ? currentSearchState = searchState.SEARCH_FOR_ANSWER_IN : currentSearchState = searchState.SEARCH_FOR_ANSWER_NOT_IN
            break
          case searchState.INCORRECT_ANSWER:  
            setIsCorrect(false)
            return
        }
      } 
      setIsCorrect(true)      
    }
  }

  useEffect(() => {
    if (data == null){
      fetch('/getjson').then(res => res.json()).then(d => {
        setData(d)
      });
    }
  }, []);


  return (
    <Page switchOn={switchOn} data={data} flashCardNumber={flashCardNumber} nextFlashCard={nextFlashCard} setUserAnswer={setUserAnswer} isCorrect={isCorrect} isAnswer={isAnswer}/>
  );
}

export default App;