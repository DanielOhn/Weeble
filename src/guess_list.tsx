import { useEffect, useState } from "react"
import "./style.css"

function GuessList(weeb: any) {
    const [guessList, setGuessList] = useState<any>([])

    useEffect(() => {
        let guesses = localStorage.getItem("guessList")


        if (guesses) {
            let data = JSON.parse(guesses)
            console.log("guesses: ", data.length)

            setGuessList(data)
        }


        // console.log("PARSE: ", parse)
    }, [localStorage.getItem("guessList")])


    if (guessList.length === 0) {
        return (<></>)
    } else {
        return (
            <div className="guess-list">{guessList.map((guess: string, ind: number) => {
                {

                    //console.log(ind)
                    if (guess === weeb.weeble.title)
                        return (<p key={ind} className="guessGreen">{guess}</p>)
                    else
                        return (<p key={ind} className="guessRed">{guess}</p>)
                }
            })}
            </div>)
    }
}

export default GuessList;
