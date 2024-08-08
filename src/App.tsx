//import lore from './lore.jpg';
import { useEffect, useState } from 'react';
import './App.css';
import { saveAs } from 'file-saver';

import animeData from "./sakugabooru-list.json";
import animeNames from "./anime-name-list.json";

import ReactPlayer from 'react-player'

interface Weeble {
  name: any;
  vid_list: any[] | undefined;
}


function App() {
  const [guess, setGuess] = useState<string>("")
  const [guesses, setGuesses] = useState<number>(0)

  const [dailyWeeble, setDailyWeeble] = useState<any>()
  const [video, setVideo] = useState<string>("")
  const [vidNum, setVidNum] = useState<number>(0)

  const [weeble, setWeeble] = useState<Weeble | undefined>(undefined)


  const [page, setPage] = useState<number>(1)
  const [anime, setAnime] = useState<any[] | undefined>()

  // const [output, setOutput] = useState<string>("")

  const [animeOptions, setAnimeOptions] = useState<any>()

  function handleResponse(response: any) {
    return response.json().then(function (json: any) {
      //return response.ok ? json : Promise.reject(json);
      //console.log(json)
      if (response.ok) {
        console.log("JSON Data: ", json)
        setWeeble({"name": weeble?.name, "vid_list": json})
      } else {
        console.log(response)
      }
    });
  }

  function handleError(error: Error) {
    alert('Error, check console');
    console.error(error);
  }

  // const setupOutput = () => {
  //   setOutput("{")
  // }

  //var fix_name

  useEffect(() => {
    if (weeble != undefined) {
      var url = `/post.json?tags=${weeble.name.name}`;
      console.log("TAG: ", weeble.name.name)

      var options = {
        method: 'GET',
        mode: "cors" as RequestMode,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
  
      fetch_data()
    }
  }, [weeble?.name])

  // TO FETCH POST
  const generateWeeble = () => {
    let anime_list = animeData.Anime
    console.log("ANIME LIST: " + JSON.stringify(anime_list.length))
    //console.log(anime_list)

    // anime_list.forEach((anim) => {
    //   console.log(anim)
    // })

    let get_daily_weeb = anime_list[(Math.floor(Math.random() * anime_list.length))]
    //console.log("Daily Weeb: " + JSON.stringify(daily_weeb))

    setWeeble({"name": get_daily_weeb, "vid_list": undefined})

  }

  const updateVideo = () => {
    if (weeble?.vid_list != undefined)
      setVideo(weeble.vid_list[vidNum].file_url)
    }

  useEffect(() => {
    if (weeble?.vid_list != undefined) {
      updateVideo()
    }
    
  }, [weeble?.vid_list, vidNum])

  // STARTING USE EFFECT TO GENERATE THE DAILY WEEBLE
  useEffect(() => {

    generateWeeble()
  }, [])


  // RETURNS ANIME OPTIONS/ SETS IT UP
  useEffect(() => {
    const extractNames = () => {

      if (animeData.Anime) {
        let data = animeData.Anime
        //console.log(data)
  
  
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
            //console.log("Temp String: " + tempStr) 
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
      let checkString = weeble.name.name

      let res = guess.replaceAll(" ", "_")
      console.log("RES: ", res.toUpperCase())
      console.log("CHECK: ", checkString)

      res = res.toUpperCase()

      checkString = checkString.toUpperCase()

      if (res === checkString) {
        alert("WIN!")
        // unlock all the vids/guesses
      }
      
      if (guesses === 6) {
        alert("u lose")
      } else {
        itrVidNum(1)
        setGuesses(guesses + 1)
      }
    }
  }
  const itrVidNum = (num: number) => {

    if (vidNum === 0 && num === -1 || vidNum === 6 && num === 1) {
      return;
    }

    setVidNum(vidNum + num)
    
  }

  // const showStates = (): any => {
  //   if (anime && dailyWeeble) {
  //     return <p>Anime: {anime} - Weeble: {dailyWeeble}</p>
  //   }
  //   return <p></p>
  // }

  // Sets up 
  // useEffect(() => {
  //   const loadAnimeOptions = () => {
  //     // load text file 
  //     //console.log(animeNames)
  //     let names: any = animeNames;

  //     return (
  //       <div>
  //         {names.anime_names.map((name: any) => {
  //           //console.log(name)
  //           return <option key={name} value={name}></option>

  //         })}
  //       </div>
  //     )
  //   }

  //   //setAnimeOptions(loadAnimeOptions)
  // }, [animeNames])



  return (
    <div className="App">
      <h1 className='header'>Weeble</h1>
      <header className="App-header">
        <ReactPlayer url={video} width="640px" height="360px" controls={true} />
      </header>

      <div >
        <button onClick={() => itrVidNum(-1)}>
          {"<"}
        </button>      
        <button onClick={() => itrVidNum(1)}>
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
