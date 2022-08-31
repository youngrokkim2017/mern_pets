import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
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