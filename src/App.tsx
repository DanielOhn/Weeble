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
  const [hideGuess, setHideGuess] = useState<boolean>(false)

  const [imgFile, setImgFile] = useState<string>("")

  const [video, setVideo] = useState<string>("")
  const [vidNum, setVidNum] = useState<number>(0)

  const [weeble, setWeeble] = useState<Weeble | undefined>(undefined)
  const [animeOptions, setAnimeOptions] = useState<any>()

  const [enableBtns, setEnableBtns] = useState<any>([true, true, true, true, true])

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
      updateVids(0)

    } else {
      fetch_data()

      localStorage.setItem("vidNum", "0")
      localStorage.setItem("guessNum", "0")
      let arr: string[] = []

      localStorage.setItem("guessList", JSON.stringify(arr))

      setGuessNum(0)
      setPrevGuesses([])
      updateVids(0)

    }

    // if (!check_local) {

    // } else {
    //   setWeeble(check_local)
    // }


  }, [])


  const updateVideo = () => {
    console.log("VID: ", weeble?.vid_list)
    if (weeble?.vid_list !== undefined) {
      console.log("VIDEO URL: ", weeble.vid_list[vidNum].file_url)
      let vid: any = weeble.vid_list[vidNum].file_url
      console.log("Video: ", vid)

      setVideo(vid)
    }
  }


  const updateVids = (num: number) => {

    if (weeble?.vid_list) {
      let vid: any = weeble?.vid_list[num].file_url
      setVideo(vid)
    }
  }

  useEffect(() => {
    
    if (weeble?.vid_list !== undefined) {
      //updateVideo()
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

      if (weeble.title === guess) {
        alert("WIN!")
        // unlock all the vids/guesses
        guess_num = 5
        iterBtn(guess_num)
        updateVids(guess_num)
        return
      }

      if (guessNum >= 5) {
        alert("u lose, the show was " + weeble.name)
        setHideGuess(true)
      } else {

        localStorage.setItem("guessNum", `${guess_num + 1}`)
        if (guess_list) {
          let lst = JSON.parse(guess_list)
          console.log("PARSED_GUESS_LIST: ", lst.guess_list)
          lst.push(guess)

          console.log("ARR: ", lst);
          localStorage.setItem("guessList", JSON.stringify(lst))
        }
        //itrVidNum(Number(localStorage.getItem("guessNum")))
        let guessing = Number(localStorage.getItem("guessNum"))
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

    console.log("ARR: ", btn_array[0])
    setEnableBtns(btn_array[num])
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
            let weeb: any = localStorage.getItem("Weeble")
            console.log(weeb)
            if (weeb)
              weeb = JSON.parse(weeb)
              weeb = weeb.title

            console.log(`${data["Weeble"].title} = ${weeb}`)

            if (data["Weeble"].title !== weeb) {
              setWeeble(data.Weeble)
              localStorage.setItem("Weeble", JSON.stringify(data))

              localStorage.setItem("vidNum", "0")
              localStorage.setItem("guessNum", "0")
              let arr: string[] = []
        
              localStorage.setItem("guessList", JSON.stringify(arr))
        
              setVidNum(0)
              setGuessNum(0)
              setPrevGuesses([])
              updateVids(0)


          }})
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
        <img src={imgFile}></img>
        <ReactPlayer url={video} width="640px" height="360px" controls={true} />
      </header>

      <div>
        <button onClick={() => updateVids(0)}>
          1
        </button>
        <button onClick={() => updateVids(1)} disabled={enableBtns[0]}>
          2
        </button>
        <button onClick={() => updateVids(2)} disabled={enableBtns[1]}>
          3
        </button>
        <button onClick={() => updateVids(3)} disabled={enableBtns[2]}>
          4
        </button>
        <button onClick={() => updateVids(4)} disabled={enableBtns[3]}>
          5
        </button>
        <button onClick={() => updateVids(5)} disabled={enableBtns[4]}>
          6
        </button>

      </div>

      <input id="anime-guess" list="anime-list" className="anime-guess" value={guess} onChange={e => { setGuess(e.target.value) }} />
      <div className="anime-list">
        <datalist id="anime-list">
          {animeOptions}
        </datalist>
      </div>

      <button className="btn" name="guess-button" onClick={guessAnime} hidden={hideGuess}>Submit Guess</button>

    </div>
  );
}

export default App;
