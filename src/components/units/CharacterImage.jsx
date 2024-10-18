import React from 'react'
import css from './CharacterImage.module.css'

export default function CharacterImage({character}) {

  let imgClass = "";
  let alignment = "";
  if(character.relic_tier > 1){
    imgClass += "relic";
    if(character.alignment === 3){
      alignment = "dark";
    } else if(character.alignment === 2){
      alignment = "light"
    } else {
      alignment = "neutral"
    }
    imgClass += alignment;

  }

  return (
    <div className={css.relative}>
      <img className={`${css.characterImage} ${css[imgClass]}`} src={"https://game-assets.swgoh.gg/textures/"+character.unit_image}/>
      {character.relic_tier < 2 && <div className={`${css.CharacterImageOverlay} ${css.levelOverlay} ${css.level}`}>{character.level}</div>}
      {character.relic_tier > 1 && <div className={`${css.CharacterImageOverlay} ${css.levelOverlay} ${css[alignment]}`}>{character.relic_tier - 2}</div>}
      {character.zeta_abilities > 0 && <div className={`${css.CharacterImageOverlay} ${css.zetaOverlay}`}>{character.zeta_abilities}</div>}
      {character.omicron_abilities > 0 && <div className={`${css.CharacterImageOverlay} ${css.omicronOverlay}`}>{character.omicron_abilities}</div>}
    </div>
  )
}
