*** Variables ***
# Homepage
${L_RPG_HOMEPAGE_HERO}              //*[@data-testid='hero']
${L_RPG_HOMEPAGE_LINKS}             //*[@data-testid='links']
${L_RPG_HOMEPAGE_PLAY}              ${L_RPG_HOMEPAGE_LINKS}//*[text()='Click here to play']
${L_RPG_HOMEPAGE_GITHUB}            ${L_RPG_HOMEPAGE_LINKS}//*[text()='View on Github']
${L_RPG_HOMEPAGE_LOGIN}             //*[@data-testid='login-button']
${L_RPG_HOMEPAGE_LOGOUT}            //*[text()='Log out']
${L_RPG_HOMEPAGE_LINK}              //span[text()='TestRPG']
${L_RPG_HOMEPAGE_TESTCODERS}        //*[@alt='TestCoders logo']
${L_RPG_HOMEPAGE_API_ENDPOINTS}     //*[text()='View api endpoints →']

# Login Popup
${L_LOGIN_EMAIL}                    //*[@name='email']
${L_LOGIN_PASSWORD}                 //*[@name='password']
${L_LOGIN_BUTTON}                   (//button[text()='Login'])[2]
${L_LOGIN_EMAIL_LABEL}              //label[text()='Email']
${L_LOGIN_EMAIL_REQUIRED}           (//p[text()='Required'])[1]
${L_LOGIN_PASSWORD_LABEL}           //label[text()='Password']
${L_LOGIN_PASSWORD_REQUIRED}        (//p[text()='Required'])[2]

# Externals
${L_GITHUB_HOMEPAGE}                (//*[@aria-label='Homepage'])[1]
${L_API_PAGE_GET}                   (//*[@data-testid='api-explainer'])[1]
${L_API_PAGE_POST}                  (//*[@data-testid='api-explainer'])[2]
${L_TESTCODERS_HOMEPAGE}            //h1[text()='TestCoders']
