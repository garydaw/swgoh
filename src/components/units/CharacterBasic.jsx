import React from 'react'
import css from './CharacterBasic.module.css'
import CharacterImage from './CharacterImage';

export default function CharacterBasic({character}) {
  console.log(character);

  const numFormatter = new Intl.NumberFormat('en-US');
  
  return (
    <div className="col-xxl-3 col-md-4 col-sm-12">
      <div className="card mb-3">
        <div className="card-header text-center">{character.character_name}</div>
        <div className={"card-body d-flex flex-column flex-lg-row " +css.customFlex}>
          <CharacterImage character={character}/>
          <p className="card-text">
            <ul className={css.cleanList}>
              <li>Power : {numFormatter.format(character.power)}</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  )
}
