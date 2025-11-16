*** Variables ***
${L_ADVENTURE_CONTAINER}                //*[@data-testid='adventure-container']
${L_ADVENTURE_CLICKER}                  //*[@data-testid='adventure-clicker']
${L_ADVENTURE_UPLOADER}                 //*[@data-testid='adventure-uploader']
${L_ADVENTURE_TYPER}                    //*[@data-testid='adventure-typer']
${L_ADVENTURE_SLIDER}                   //*[@data-testid='adventure-slider']

${L_ADVENTURE_CLICKER_BUTTON}           ${L_ADVENTURE_CLICKER}//button
${L_ADVENTURE_UPLOAD_BUTTON}            //input[@type='file']
${L_ADVENTURE_TYPER_INPUT}              ${L_ADVENTURE_TYPER}//input
${L_ADVENTURE_SLIDER_INPUT}             //*[@dir='ltr']
${L_ADVENTURE_SLIDER_INPUT_HANDLER}     //span[@role='slider']

${L_ADVENTURE_CLICKER_SUCCESS}          //*[text()='Great job! You levelled up']
${L_ADVENTURE_UPLOADER_SUCCESS}         //*[text()='File selected, level up!']
${L_ADVENTURE_TYPER_SUCCESS}            //*[text()='Dolar sit amet!']
${L_ADVENTURE_SLIDER_SUCCESS}           //*[text()='Slid to the next level!']
${L_ADVENTURE_HIGHEST_LEVEL}            //*[text()="You've reached the highest level! "]

${L_ADVENTURE_PLAY_AGAIN}               //*[@data-play-again='true']
