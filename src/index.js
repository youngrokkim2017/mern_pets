import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Axios from 'axios';
import CreateNewForm from './components/CreateNewForm';
import AnimalCard from './components/AnimalCard';

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
        <div className="container">
            <h1><a href='/'>&laquo; Back to Home</a></h1>

            <CreateNewForm setAnimals={setAnimals} />
            <div>
                {animals.map((animal) => {
                    return (
                        <AnimalCard 
                            key={animal.id} 
                            name={animal.name} 
                            species={animal.species} 
                            photo={animal.photo} 
                            id={animal.id} 
                            setAnimals={setAnimals} 
                        />
                    )
                })}
            </div>
        </div>
    )
}

const root = createRoot(document.querySelector('#app'));
root.render(<App />)