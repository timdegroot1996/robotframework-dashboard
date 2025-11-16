*** Variables ***
${S_HEADLESS}       ${True}
${S_BROWSER}        chromium
${S_URL}            https://test-rpg.vercel.app/

@{S_STATS}          strength    agility    wisdom    magic
&{S_THIEF}          strength=1    agility=6    wisdom=2    magic=1    level=1
&{S_KNIGHT}         strength=6    agility=2    wisdom=1    magic=1    level=1
&{S_MAGE}           strength=0    agility=1    wisdom=3    magic=6    level=1
&{S_BRIGADIER}      strength=3    agility=1    wisdom=6    magic=1    level=1
&{S_BUILDS}         thief=${S_THIEF}    knight=${S_KNIGHT}    mage=${S_MAGE}    brigadier=${S_BRIGADIER}
