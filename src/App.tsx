//import lore from './lore.jpg';
import { useEffect, useState } from 'react';
import './App.css';
import { saveAs } from 'file-saver';

import animeData from "./sakugabooru-list.json";
import animeNames from "./anime-name-list.json";

import ReactPlayer from 'react-player'

interface Weeble {
  title: string;
  name: string;
  vid_list: any[] | undefined;
}


function App() {
  const [guess, setGuess] = useState<string>("")
  const [prevGuesses, setPrevGuesses] = useState<string[]>()
  const [guessNum, setGuessNum] = useState<number>(0)

  const [video, setVideo] = useState<string>("")
  const [vidNum, setVidNum] = useState<number>(0)
  const [backDisable, setBackDisable] = useState(true)
  const [frontDisable, setFrontDisable] = useState(false)

  const [weeble, setWeeble] = useState<Weeble | undefined>(undefined)
  const [animeOptions, setAnimeOptions] = useState<any>()

  function handleResponse(response: any) {
    console.log(response)
    return response.json().then(function (json: any) {
      //return response.ok ? json : Promise.reject(json);
      //console.log(json)
      if (response.ok) {
        console.log("JSON Data: ", json.Weeble)
        let data = json.Weeble
        if (localStorage.getItem("Weeble")) {
          let local_weeble = localStorage.getItem("Weeble")
          console.log("RES LOCAL WEEBLE: ", local_weeble)
          //let parse_weeble = JSON.parse(local_weeble)

          if (data.name === local_weeble)

            localStorage.setItem("Weeble", JSON.stringify(data))

        } else {
          setWeeble(data)
          localStorage.setItem("Weeble", JSON.stringify(data))
        }
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
      checkWeeble()
      let parseData = JSON.parse(check_local)

      console.log("LOCAL: ", JSON.parse(check_local))
      localStorage.setItem("vidNum", "0")
      setWeeble(parseData)

    } else {
      fetch_data()

      localStorage.setItem("vidNum", "0")
      localStorage.setItem("guessNum", "0")
      let arr: string[] = []

      localStorage.setItem("guessList", JSON.stringify(arr))

      setVidNum(0)
      setGuessNum(0)
      setPrevGuesses([])
      //setGuesses
    }

    // if (!check_local) {

    // } else {
    //   setWeeble(check_local)
    // }


  }, [])


  const updateVideo = () => {
    if (weeble?.vid_list != undefined) {
      console.log("VIDEO URL: ", weeble.vid_list[vidNum].file_url)
      let vid: any = weeble.vid_list[vidNum].file_url
      console.log("Video: ", vid)

      setVideo(vid)
    }
  }

  useEffect(() => {
    if (weeble?.vid_list != undefined) {
      updateVideo()
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

  const showWeeble = () => {
    console.log(weeble)
  }

  const guessAnime = () => {
    if (weeble) {
      console.log(weeble.title, guess)

      let vid_num = Number(localStorage.getItem("vidNum"))
      let guess_num = Number(localStorage.getItem("guessNum"))
      let guess_list: any = localStorage.getItem("guessList")

      console.log("LOCAL VID NUM: ", vid_num)
      console.log("GUESS_LIST: ", guess_list)

      if (weeble.title === guess) {
        alert("WIN!")
        // unlock all the vids/guesses
      }

      if (guessNum >= 5) {
        alert("u lose, the show was " + weeble.name)
      } else {

        localStorage.setItem("vidNum", `${vid_num + 1}`)
        localStorage.setItem("guessNum", `${guess_num + 1}`)
        if (guess_list) {
          let lst = JSON.parse(guess_list)
          console.log("PARSED_GUESS_LIST: ", lst.guess_list)
          lst.push(guess)

          console.log("ARR: ", lst);
          localStorage.setItem("guessList", JSON.stringify(lst))
        }
        itrVidNum(Number(localStorage.getItem("guessNum")))
        setGuessNum(Number(localStorage.getItem("guessNum")))
      }
    }
  }
  const itrVidNum = (num: number) => {

    
    console.log("Vid # ", vidNum)
    console.log("Guess # ", guessNum)
    if (vidNum === 0 && num === -1 || vidNum === 5 && num === 1) {
      return;
    }

    localStorage.setItem("vidNum", `${vidNum + num}`)
    let vid_num = Number(localStorage.getItem("vidNum"))

    setVidNum(vid_num)
    console.log(vidNum)

    if (vid_num == 0) {
      setBackDisable(true);
    } else {
      setBackDisable(false);
    }

    if (vidNum == 5 || vidNum < guessNum + 1) {
      setFrontDisable(true);
    } else {
      setFrontDisable(false);
    }
  }

  const checkWeeble = () => {
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
            console.log(`${data.title} = ${weeble?.title}`)


          })
        })
        .catch(handleError);
    }
    catch (err) {
      alert(err);
    }

  }


  return (
    <div className="App">
      <h1 className='header'>Weeble</h1>
      <header className="App-header">
        <ReactPlayer url={video} width="640px" height="360px" controls={true} />
      </header>

      <div >
        <button onClick={() => itrVidNum(-1)} disabled={backDisable}>
          {"<"}
        </button>
        <button onClick={() => itrVidNum(1)} disabled={frontDisable}>
          {">"}
        </button>
      </div>

      <button onClick={showWeeble}>
        Show Weeble
      </button>

      <input id="anime-guess" list="anime-list" className="anime-guess" value={guess} onChange={e => { setGuess(e.target.value) }} />
      <div className="anime-list">
        <datalist id="anime-list">
          {animeOptions}
        </datalist>
      </div>

      <button className="btn" name="guess-button" onClick={guessAnime}>Submit Guess</button>

    </div>
  );
}

export default App;
