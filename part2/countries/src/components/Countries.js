import Country from "./Country"

const Countries = ({ data, button, API_KEY }) => {

    const l = data.length

    if (l > 10) {
        return (
            <>
                <p>Too many matches, specify another filter</p>
            </>
        )
    }
    else if (l <= 10 & l > 1) {
        return (
            <>  
                {data.map( (x, i) => 
                    <p 
                        key={i}>{x.name.common} 
                        <button onClick={() => button(x.name.common)}>
                             show 
                        </button>
                    </p>)}
            </>
        )
    }
    else if (l === 1) {
        return (
            <Country data={data} API_KEY={API_KEY} />
        )
    }
    else {
        return (
            <>
                <p>No countries found</p>
            </>
        )
    }
}

export default Countries