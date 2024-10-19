/*
* Helper for filtering unit lists
*
*/
export const unitSearch = (units, value) => {

  if (value) {
    const filtered = units.filter(character => {
      const lowerCaseName = character.character_name.toString().toLowerCase();
      const lowerCaseAlignment = character.alignment_label.toString().toLowerCase();
      const lowerCaseCategories = character.categories.toString().toLowerCase();
      const lowerCaseRole = character.role.toString().toLowerCase();
      
      // Convert the value to lowercase and split by spaces to get individual words
      const words = value.toLowerCase().split(' ');
    
      // Check if all words are present in any property
      return words.every(word =>
        lowerCaseName.includes(word) ||
        lowerCaseAlignment.includes(word) ||
        lowerCaseCategories.includes(word) ||
        lowerCaseRole.includes(word)
      );
    });
    return filtered;
  } else {
    return units;
  }
};
