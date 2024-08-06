//import lore from './lore.jpg';
import { useEffect, useState } from 'react';
import './App.css';
import { saveAs } from 'file-saver';

import animeData from "./sakugabooru-list.json";
import animeNames from "./anime-name-list.json";

import ReactPlayer from 'react-player'

interface AnimeInfo {
  id: number;
  name: string;
}


function App() {
  const [guess, setGuess] = useState<string>("")
  const [guesses, setGuesses] = useState<number>(0)

  const [dailyWeeble, setDailyWeeble] = useState<string>("")
  const [video, setVideo] = useState<string>("")
  const [vidNum, setVidNum] = useState<number>(0)


  const [page, setPage] = useState<number>(1)
  const [anime, setAnime] = useState<any[] | undefined>()

  const [output, setOutput] = useState<string>("")

  const [animeOptions, setAnimeOptions] = useState<any>()


  // var query = `
  // query ($id: Int) { # Define which variables will be used in the query (id)
  //   Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
  //     id
  //     title {
  //       romaji
  //       english
  //       native
  //     }

  //   }
  // }
  // `;

  // Define our query variables and values that will be used in the query request

  function handleResponse(response: any) {
    return response.json().then(function (json: any) {
      //return response.ok ? json : Promise.reject(json);
      //console.log(json)
      if (response.ok) {
        setAnime(json)
      } else {
        console.log(response)
      }
    });
  }

  function handleError(error: Error) {
    alert('Error, check console');
    console.error(error);
  }

  const setupOutput = () => {
    setOutput("{")
  }

  //var fix_name

  // TO FETCH POST
  const generateContent = () => {
    let anime_list = animeData.Anime
    console.log("ANIME LIST: " + JSON.stringify(anime_list.length))
    //console.log(anime_list)

    // anime_list.forEach((anim) => {
    //   console.log(anim)
    // })

    let daily_weeb = anime_list[(Math.floor(Math.random() * anime_list.length))]
    //console.log("Daily Weeb: " + JSON.stringify(daily_weeb))


    var url = `/post.json?tags=${daily_weeb.name}`;

    var options = {
      method: 'GET',
      mode: "cors" as RequestMode,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
      // body: JSON.stringify({
      //     query: query,
      //     variables: variables
      // })
    };


    const fetch_data = () => {
      try {
        fetch(url, options).then(handleResponse)
          .catch(handleError);
      }
      catch (err) {
        alert(err);
      }
    }

    fetch_data()
    //console.log("Get Anime: " + JSON.stringify(anime_list))


    let tempStr = daily_weeb.name.replaceAll("_", " ")
    let finalWeeb = tempStr;
    console.log("TEMP: " + tempStr)
    for (let i = 0; i < finalWeeb.length; i++) {

      if (i === 0 || finalWeeb[i - 1] === " ") {
        //console.log(finalWeeb.charAt(i).toUpperCase())
        let char = finalWeeb.charAt(i).toUpperCase()
        finalWeeb = finalWeeb.substring(0, i) + char + finalWeeb.substring(i + 1)
      }
    }

    console.log("Final Weeb: " + finalWeeb)

    if (finalWeeb) {
      setDailyWeeble(finalWeeb)

    }

    //setDailyWeeble("Testing")
    if (anime) {
      setVideo(anime[0].file_url)
    }

  }

  useEffect(() => {
    if (anime) {
      setVideo(anime[vidNum].file_url)
    }
  }, [anime, vidNum])

  useEffect(() => {
    setupOutput()
    //console.log(output)
    generateContent()
  }, [])

  // TO FETCH TAGS
  // useEffect(()  => {

  //   var url = `/tag.json?type=3&limit=8&order=count&page=${page}`;

  //   var options = {
  //     method: 'GET',
  //     mode: "cors" as RequestMode,
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //     }
  //   };

  //   const fetch_data = () => {
  //       try {
  //         fetch(url, options).then(handleResponse)
  //           .catch(handleError);
  //       }
  //       catch(err) {
  //         alert(err);
  //       }
  //     }

  //     //fetch_data()
  // }, [page])

  const nextPage = () => {
    setPage(page + 1)
    //console.log(`Page #: ${page}`)
  }

  const toText = () => {
    var res: string = `{ "Anime": [`
    if (anime) {
      anime.forEach((tag, ind) => {

        res += `{"id": ${tag.id}, "name": "${tag.name}"}`
        if (anime.length - 1 != ind) {
          res += ", "
        }
      });
    }

    //console.log(res)

    setOutput(res)
  }

  // const extractNames = () => {
  //   let nameResult: string = `{ "anime_names": [`

  //   if (anime) {
  //     anime.forEach((ani) => {
  //       let tempStr = ani.name
  //       tempStr = tempStr.replaceAll("_", " ")

  //       for (let i = 0; i < tempStr.length; i++) {
  //         if (i === 0 || tempStr[i - 1] === " ") {
  //           let char = tempStr.charAt(i).toUpperCase()
  //           tempStr = tempStr.substring(0,i) + char + tempStr.substring(i+1)
  //         }
  //       }
  //       //console.log(tempStr)

  //       nameResult += `"${tempStr}",`

  //       //nameResult += tempStr + "\n"
  //     })

  //   }
  //   let finalResult = nameResult.slice(0, -1) + "]}"
  //   //nameResult.charAt(nameResult.length) = "}"

  //   //console.log(finalResult)

  //   const file = new Blob([finalResult], { type: 'text/plain;charset=utf-8' });
  //   saveAs(file, "anime-name-list.json")

  // }
  useEffect(() => {
    const extractNames = () => {

      if (animeData.Anime) {
        let data = animeData.Anime
        console.log(data)
  
  
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
            console.log("Temp String: " + tempStr) 
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
  


  const printAnime = () => {
    console.log(anime)

    //const file = new Blob(['Hello, world!'], { type: 'text/plain;charset=utf-8' });
    // saveAs(file)
  }

  const showWeeble = () => {
    console.log(dailyWeeble)
  }

  const printOutput = () => {
    console.log(output)
  }

  const saveFile = () => {
    setOutput(output + "]}")
    const file = new Blob([output], { type: 'text/plain;charset=utf-8' });
    saveAs(file, "sakugabooru-list.json")
  }

  const guessAnime = () => {
    console.log(guess)
    if (guess == dailyWeeble) {
      alert("WIN!")
      // unlock all the vids/guesses
    }

    setGuesses(guesses + 1)

    if (guesses >= 5) {
      alert("u lose")
    } else {
      setVidNum(vidNum + 1)
    }
  }

  useEffect(() => {
    const loadAnimeOptions = () => {
      // load text file 
      //console.log(animeNames)
      let names: any = animeNames;
      //console.log(names.anime_names)

      // for (let i = 0; i < names.anime_names.length; i++) {
      //   console.log(names.anime_names[i])

      // names.anime_names.map((name: any) => {
      //   //console.log(name)
      // })

      // }
      return (
        <div>
          {names.anime_names.map((name: any) => {
            //console.log(name)
            return <option key={name} value={name}></option>

          })}
        </div>
      )
    }

    //setAnimeOptions(loadAnimeOptions)
  }, [animeNames])



  return (
    <div className="App">
      <h1 className='header'>Weeble</h1>
      <header className="App-header">
        <ReactPlayer url={video} width="640px" height="360px" controls={true} />
      </header>

      {/* <div>
        <button className="btn" onClick={nextPage}>
          Next Page
        </button>
        <button className="btn" onClick={toText}>
          Convert To Text
        </button><br />

        <button className="btn" onClick={printAnime}>
          Print Anime
        </button>
        <button className="btn" onClick={printOutput}>
          Print Text Output
        </button> */}
      {/* <button className="btn" onClick={extractNames}>
        Extract Names
      </button><br /> */}
      {/* 
        <button className="btn" onClick={saveFile}>
          Save
        </button>
      </div> */}

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
