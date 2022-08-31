import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Axios from 'axios';

function App() {
    const [animals, setAnimals] = useState([])

    useEffect(() => {
        async function go() {
            const response = await Axios.get("/api/animals")
            setAnimals(response.data)
        }
        go()
    }, [])

    return (
        <div>
            <h1>React</h1>
            {animals.map((animal) => {
                return <AnimalCard name={animal.name} species={animal.species} />
            })}
        </div>
    )
}

function AnimalCard(props) {
    return <p>Hi, my name is {props.name} and I am a {props.species}</p>
}

const root = createRoot(document.querySelector('#app'));
root.render(<App />)