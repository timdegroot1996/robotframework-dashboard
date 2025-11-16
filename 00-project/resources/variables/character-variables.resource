*** Variables ***
${L_CHARACTER_CARD}                 (//*[@data-testid='character-card'])[1]
${L_CHARACTER_INPUT}                (//*[@data-testid='character-card'])[2]
${L_CHARACTER_NAME}                 //*[@data-testid='character-name' and text()='{name}']
${L_CHARACTER_DESCRIPTION}          (//*[@data-testid='character-stats'])[1]
${L_CHARACTER_DETAILS}              (//*[@data-testid='character-stats'])[2]
${L_CHARACTER_IMAGE}                //*[@data-testid='character-image']

${L_CHARACTER_NAME_INPUT}           //*[@name='name']
${L_CHARACTER_NAME_LABEL}           //label[text()='Character name']
${L_CHARACTER_NAME_SHORT}           //p[text()='Name must be at least 3 characters']
${L_CHARACTER_NAME_LONG}            //p[text()='Name cannot be longer than 20 characters']

${L_CHARACTER_BUILD_SELECTION}      //*[@role='combobox']
${L_CHARACTER_BUILD_OPTION}         //div[@role='option']//span[text()='{build}']

${L_CHARACTER_STRENGTH_STAT}        //*[@data-character-stats='Strength']//span[text()='{strength}']
${L_CHARACTER_STRENGTH_BAR}         //*[@data-character-stats='Strength']//div[@style='transform: translateX({value}%);']
${L_CHARACTER_AGILITY_STAT}         //*[@data-character-stats='Agility']//span[text()='{agility}']
${L_CHARACTER_AGILITY_BAR}          //*[@data-character-stats='Agility']//div[@style='transform: translateX({value}%);']
${L_CHARACTER_WISDOM_STAT}          //*[@data-character-stats='Wisdom']//span[text()='{wisdom}']
${L_CHARACTER_WISDOM_BAR}           //*[@data-character-stats='Wisdom']//div[@style='transform: translateX({value}%);']
${L_CHARACTER_MAGIC_STAT}           //*[@data-character-stats='Magic']//span[text()='{magic}']
${L_CHARACTER_MAGIC_BAR}            //*[@data-character-stats='Magic']//div[@style='transform: translateX({value}%);']
${L_CHARACTER_LEVEL_STAT}           //*[@data-character-stats='Level']//span[text()='{level}']
${L_CHARACTER_LEVEL_BAR}            //*[@data-character-stats='Level']//div[@style='transform: translateX({value}%);']

${L_START_GAME}                     //*[text()='Start!']
