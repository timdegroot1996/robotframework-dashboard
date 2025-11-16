from random import randint, choice

def get_random_stats():
    stats = ['strength', 'wisdom', 'agility', 'magic']
    total = 10
    result = {}
    for i in range(0, len(stats)):
        stat = choice(stats)
        stats.remove(stat)
        value = randint(0, total)
        total -= value
        result[stat] = value
    return result
