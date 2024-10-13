# create statements
CREATE_STATS = """ CREATE TABLE IF NOT EXISTS stats ("add_date" TEXT, "total" INTEGER, "passed" INTEGER, "failed" INTEGER, "skipped" INTEGER, "elapsed" INTEGER, unique (add_date)); """
CREATE_SUITES = """ CREATE TABLE IF NOT EXISTS suites ("add_date" TEXT, "full_name" TEXT, "name" TEXT, "passed" INTEGER, "failed" INTEGER, "skipped" INTEGER, "elapsed" INTEGER, "start_time" TEXT, "end_time" TEXT, unique (add_date)); """
CREATE_TESTS = """ CREATE TABLE IF NOT EXISTS tests ("add_date" TEXT, "full_name" TEXT, "name" TEXT, "passed" INTEGER, "failed" INTEGER, "skipped" INTEGER, "elapsed" INTEGER, "start_time" TEXT, "end_time" TEXT, "tags" TEXT, unique (add_date)); """
CREATE_KEYWORDS = """ CREATE TABLE IF NOT EXISTS keywords ("add_date" TEXT, "name" TEXT, "passed" INTEGER, "failed" INTEGER, "skipped" INTEGER, "elapsed" INTEGER, "start_time" TEXT, "end_time" TEXT, "tags" TEXT, unique (add_date)); """

INSERT_INTO_STATS = """ INSERT INTO stats VALUES (?,?,?,?,?,?) """
INSERT_INTO_SUTIES = """ INSERT INTO stats VALUES (?,?,?,?,?,?,?,?,?) """
INSERT_INTO_TESTS = """ INSERT INTO stats VALUES (?,?,?,?,?,?,?,?,?,?) """
INSERT_INTO_KEYWORDS = """ INSERT INTO stats VALUES (?,?,?,?,?,?,?,?,?) """

DELETE_FROM_TABLE = """ DELETE FROM {table} WHERE date="{date}" """