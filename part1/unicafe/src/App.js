import { useState } from 'react'

const StatisticLine = ({ text, value }) => <tr><td>{text} {value}</td></tr>

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
    if (all > 0) {
        return (
            <div>
                <table>
                    <tbody>
                        <StatisticLine text="good" value ={good} />
                        <StatisticLine text="neutral" value ={neutral} />
                        <StatisticLine text="bad" value ={bad} />
                        <StatisticLine text="all" value={all} />
                        <StatisticLine text="average" value={average} />
                        <StatisticLine text="positive" value={positive} />
                    </tbody>
                </table>
            </div>
        )
    }
    return (
        <div>
            <p>
                No feedback given
            </p>
        </div>
    )
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const all = good + neutral + bad
    const average = ((1*good) + (0*neutral) + (-1*bad)) / all
    const positive = 100 * (good / all)


    return (
        <>
            <div>
                <h1>give feedback</h1>
                <Button handleClick={() => setGood(good + 1)} text="good"/>
                <Button handleClick={() => setNeutral(neutral + 1)} text="neutral"/>
                <Button handleClick={() => setBad(bad + 1)} text="bad"/>
                <h1>statistics</h1>
            </div>
            <Statistics
                good={good}
                neutral={neutral}
                bad={bad}
                all={all}
                average={average}
                positive={positive}
            />
        </>
    )
}

export default App