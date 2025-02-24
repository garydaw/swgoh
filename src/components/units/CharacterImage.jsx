import React from 'react'
import css from './CharacterImage.module.css'

export default function CharacterImage({character, centreImage = "true"}) {

  let imgClass = "";
  if(character.relic_tier > 1){
    imgClass += "relic" + character.alignment_label;
  }
  
  return (
    <div className={centreImage === "true" ? css.centreImage : ''}>
    <div className={css.relative}>
      <img className={`${css.characterImage} ${css[imgClass]}`} src={"../swgoh/images/units/"+character.unit_image}/>
      {character.relic_tier < 2 && <div className={`${css.CharacterImageOverlay} ${css.levelOverlay} ${css.level}`}>{character.level}</div>}
      {character.relic_tier > 1 && <div className={`${css.CharacterImageOverlay} ${css.levelOverlay} ${css[character.alignment_label]}`}>{character.relic_tier - 2}</div>}
      {character.zeta_abilities > 0 && <div className={`${css.CharacterImageOverlay} ${css.zetaOverlay}`}>{character.zeta_abilities}</div>}
      {character.omicron_abilities > 0 && <div className={`${css.CharacterImageOverlay} ${css.omicronOverlay}`}>{character.omicron_abilities}</div>}
    </div>
    </div>
  )
}
