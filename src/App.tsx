//import lore from './lore.jpg';
import { useEffect, useState, ReactNode } from 'react';
import './App.css';
import { saveAs } from 'file-saver';

import animeData from "./sakugabooru-list.json";
//import animeNames from "./anime-name-list.json";

import ReactPlayer from 'react-player'
import GuessList from "./guess_list"

interface Weeble {
  title: string;
  name: string;
  vid_list: any[] | undefined;
}


function App() {
  const [guess, setGuess] = useState<string>("")
  //const [prevGuesses, setPrevGuesses] = useState<string[]>()
  const [guessNum, setGuessNum] = useState<number>(0)
  const [hideGuess, setHideGuess] = useState<boolean>(false)
  const [revealGuess, setRevealGuess] = useState<string>("Reveal Weeble")

  const [imgFile, setImgFile] = useState<string>("")
  const [video, setVideo] = useState<string>("")
  const [vidNum, setVidNum] = useState<number>(0)

  const [weeble, setWeeble] = useState<Weeble | undefined>(undefined)
  const [animeOptions, setAnimeOptions] = useState<any>()

  const [enableBtns, setEnableBtns] = useState<any>([true, true, true, true, true])
  const [copyText, setCopyText] = useState<string>("Copy Results")

  function handleResponse(response: any) {
    console.log(response)
    return response.json().then(function (json: any) {
      //return response.ok ? json : Promise.reject(json);
      //console.log(json)
      if (response.ok) {
        console.log("JSON Data: ", json.Weeble)
        let data = json.Weeble

        setGuessNum(0)
        setWeeble(data)
        localStorage.setItem("Weeble", JSON.stringify(data))
        //setPrevGuesses([])
        updateVids(0)
      } else {
        console.log(response)
      }
    });
  }

  function handleError(error: Error) {
    alert('Error, check console');
    console.error(error);
  }


  useEffect(() => {

    var url = `http://localhost:3005/`;
    //console.log("TAG: ", weeble.name.name)

    var options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };


    const fetch_data = () => {
      try {
        fetch(url, options)
          .then(handleResponse)
          .catch(handleError);
      }
      catch (err) {
        alert(err);
      }
    }

    let check_local = localStorage.getItem("Weeble")

    if (check_local) {
      checkWeeble(check_local)

    } else {
      fetch_data()
      localStorage.setItem("vidNum", "0")
      localStorage.setItem("guessNum", "0")
      let arr: string[] = []
      localStorage.setItem("guessList", JSON.stringify(arr))

    }

    // if (!check_local) {

    // } else {
    //   setWeeble(check_local)
    // }


  }, [])

  const updateVids = (num: number) => {
    if (weeble?.vid_list) {
      let url: any = weeble?.vid_list[num].file_url

      let check = url.split(".")
      console.log("VID: ", check[3])

      if (check[3] === "mp4") {
        setVideo(url)
        setImgFile("")
      } else {
        setVideo("")
        setImgFile(url)
      }

    }
    //console.log("UPDATE VIDS WEEB: ", weeble)
  }

  useEffect(() => {

    if (weeble?.vid_list !== undefined) {
      updateVids(vidNum)
    }

  }, [weeble?.vid_list, guessNum, vidNum])

  // RETURNS ANIME OPTIONS/ SETS IT UP
  useEffect(() => {
    const extractNames = () => {

      if (animeData.Anime) {
        let data = animeData.Anime

        return (
          <div>
            {data.map((ani: any) => {
              //console.log(ani)
              let tempStr = ani.name
              tempStr = tempStr.replaceAll("_", " ")
              for (let i = 0; i < tempStr.length; i++) {
                if (i === 0 || tempStr[i - 1] === " ") {
                  let char = tempStr.charAt(i).toUpperCase()
                  tempStr = tempStr.substring(0, i) + char + tempStr.substring(i + 1)
                }
              }
              return (
                <option key={ani.id} value={tempStr}></option>
              )
            })}
          </div>
        )

      } else {
        return (<p>None</p>)
      }

    }
    setAnimeOptions(extractNames)
  }, [])

  const guessAnime = () => {
    if (weeble) {
      console.log(weeble.title, guess)

      let guess_num = Number(localStorage.getItem("guessNum"))
      let guess_list: any = localStorage.getItem("guessList")

      console.log("GUESS_LIST: ", guess_list)

      if (guess_list) {
        let lst = JSON.parse(guess_list)
        console.log("PARSED_GUESS_LIST: ", lst.guess_list)
        lst.push(guess)

        console.log("ARR: ", lst);
        localStorage.setItem("guessList", JSON.stringify(lst))
      }

      if (weeble.title === guess) {
        alert("WIN!")
        // unlock all the vids/guesses
        guess_num = 5
        iterBtn(guess_num)
        updateVids(guess_num)
        setGuessNum(6)
        localStorage.setItem("guessNum", `${6}`)
      } else if (guessNum >= 5) {

        setHideGuess(true)
        setGuessNum(guessNum + 1)
        localStorage.setItem("guessNum", `${guess_num + 1}`)
        alert("u lose, the show was " + weeble.title)
      } else {

        localStorage.setItem("guessNum", `${guess_num + 1}`)
        localStorage.setItem("vidNum", `${guess_num + 1}`)

        //itrVidNum(Number(localStorage.getItem("guessNum")))
        let guessing = guess_num + 1
        setVidNum(guessing)
        setGuessNum(guessing)
        iterBtn(guessing)
        updateVids(guessing)
      }


    }
  }

  const iterBtn = (num: number) => {


    let btn_array = [
      [true, true, true, true, true],
      [false, true, true, true, true],
      [false, false, true, true, true],
      [false, false, false, true, true],
      [false, false, false, false, true],
      [false, false, false, false, false]
    ]

    if (num > btn_array.length - 1) {
      num = 5
    }

    console.log("ARR: ", btn_array[0])
    setEnableBtns(btn_array[num])
  }

  const checkWeeble = (arg_weeb: any) => {
    var url = `http://localhost:3005/`;
    //console.log("TAG: ", weeble.name.name)
    //console.log(check_weeble)

    var options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };

    try {
      fetch(url, options)
        .then((res) => {
          return res.json().then((data) => {
            //let weeb: any = localStorage.getItem("Weeble")
            let weeb = arg_weeb

            if (weeb)
              weeb = JSON.parse(weeb)
            console.log("WEEBLE: ", weeb)
            let weeb_name = weeb.title

            if (data["Weeble"].title !== weeb_name) {
              console.log("Weeble != Local Weeble")
              setWeeble(data.Weeble)
              localStorage.setItem("Weeble", JSON.stringify(data.Weeble))

              localStorage.setItem("vidNum", "0")
              localStorage.setItem("guessNum", "0")
              let arr: string[] = []


              setVideo(data["Weeble"].vid_list[0].file_url)
              setVidNum(0)
              setGuessNum(0)
              localStorage.setItem("guessList", JSON.stringify(arr))
              //setPrevGuesses([]) // Should pull from local storage
            } else {
              //console.log(localStorage.getItem("vidNum"))
              let guess_num: number = Number(localStorage.getItem("guessNum"))
              let guesses: any = localStorage.getItem("guessList")
              //setPrevGuesses(guesses)
              console.log("GUESS_NUM: ", guess_num)

              console.log(guesses)
              iterBtn(guess_num)
              setWeeble(data["Weeble"])
              setGuessNum(guess_num)
              setVideo(data["Weeble"].vid_list[0].file_url)
            }
          })
        })
        .catch(handleError);
    }
    catch (err) {
      alert(err);
    }

  }
  const revealWeeble = () => {
    if (weeble)
      setRevealGuess(weeble.title)
  }

  const copyResults = () => {
    let text = `Weeble Result \n`

    let guesses = localStorage.getItem("guessList")

    if (guesses) {
      let data = JSON.parse(guesses)

      data.map((temp_guess: string) => {
        console.log(temp_guess)
        if (temp_guess === weeble?.title) {
          text += "🟢 "
        } else {
          text += "🔴 "
        }
      })
    }

    navigator.clipboard.writeText(text)
    setCopyText("Copied")
  }

  return (
    <div className="App">
      <h1 className='header'>Weeble</h1>
      <header className="App-header">
        <img className="image" src={imgFile}></img>
        <ReactPlayer url={video} width="640px" height="360px" controls={true} />
      </header>

      <div>
        <button className="vid-btns" onClick={() => updateVids(0)}>
          1
        </button>
        <button className="vid-btns" onClick={() => updateVids(1)} disabled={enableBtns[0]}>
          2
        </button>
        <button className="vid-btns" onClick={() => updateVids(2)} disabled={enableBtns[1]}>
          3
        </button>
        <button className="vid-btns" onClick={() => updateVids(3)} disabled={enableBtns[2]}>
          4
        </button>
        <button className="vid-btns" onClick={() => updateVids(4)} disabled={enableBtns[3]}>
          5
        </button>
        <button className="vid-btns" onClick={() => updateVids(5)} disabled={enableBtns[4]}>
          6
        </button>
      </div>
      <div>
        <h3>guesses: {6 - guessNum}</h3>
      </div>

      {weeble ?
        <GuessList weeble={weeble} /> : <></>
      }
      


      {guessNum < 6 ? <>
        <input id="anime-guess" list="anime-list" className="anime-guess" value={guess} onChange={e => { setGuess(e.target.value) }} />
        <div className="anime-list">
          <datalist id="anime-list">
            {animeOptions}
          </datalist>
        </div>
        <button className="btn" name="guess-button" onClick={guessAnime} hidden={hideGuess}>Submit Guess</button></>
        : <>
          <button className="btn" name="reveal" onClick={revealWeeble}>{revealGuess}</button>
          <button className="btn" name="copy" onClick={copyResults}>{copyText}</button>
        </>
      }

    </div>
  );
}

export default App;
