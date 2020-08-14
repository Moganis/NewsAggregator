import React from 'react';
import './heroes.styles.css';

class Heroes extends React.Component{
    constructor(){
        super();
        this.state = {
            heroes: []
        }
    }

    componentDidMount(){
        fetch('/api/heroes')
        .then(res =>res.json())
        .then(heroes => this.setState({ heroes: heroes}))
    }
    render(){
        return(
            <div>
                <h1>Heroes</h1>
                <ul>
                    {this.state.heroes.map(hero =>
                        <li key={hero.id}>{hero.username}: {hero.password}</li>
                        )}
                </ul>
            </div>
        )
    }


}

export default Heroes;