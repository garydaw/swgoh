import React from 'react'
import { useNavigate } from "react-router";
import css from './CharacterDetails.module.css'


export default function CharacterDetails({character}) {
  
  let data = [];
  
  for(let m=1; m<=6; m++) {
    let mod = {}
    if (character[`primary${m}`] == null) {
      mod.title = '';
      mod.subtitle = 'This slot is empty';
      mod.text = [];
      mod.img = ``;
    } else {
      const letter = String.fromCharCode(70 - character[`tier${m}`])
      mod.title = `${character[`slot${m}`]} MK ${character[`rarity${m}`]}-${letter} (${character[`set${m}`]})`;
      mod.subtitle = `Primary ${character[`primary${m}`]}`
      mod.text = [character[`secondaryOne${m}`], character[`secondaryTwo${m}`], character[`secondaryThree${m}`], character[`secondaryFour${m}`]];
      mod.bestMod = character[`bestMod${m}`];
      mod.bestModMatch = character[`modMatch${m}`];
  }
    data.push(mod);
  }
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div>
      <div className="d-flex justify-content mb-2">
        <h2>Character Details</h2>
      </div>
      <p>
        Details for {character.character_name}
      </p>
      <div className={css.twoColumnGrid}>
        {data.map((item, index) => (
          <div key={index} className={css.card}>
           
              <div className={css.textSection}>
                <h2 className={css.title}>{item.title}</h2>
                <h3 className={`${css.subtitle} ${item.bestModMatch === 1 ? css.green : css.red}`}>{item.subtitle}</h3>
                <ul className={css.textList}>
                  {item.text.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className={css.textSectionBestPrimary}>
                <h2 className={css.title}>Best Primary</h2>
                <h3 className={`${css.subtitle} ${item.bestModMatch === 1 ? css.green : css.red}`}>{item.bestMod}</h3>
              </div>
              <div><i>Image later</i></div>
              
             
          </div>
        ))}
      </div>
      <button type="button" onClick={goBack} className="btn btn-primary">Back</button>
    </div>
  )
}


