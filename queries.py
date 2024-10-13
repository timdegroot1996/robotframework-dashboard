# create statements
CREATE_STATS = """ CREATE TABLE IF NOT EXISTS stats ("add_date" TEXT, "total" INTEGER, "passed" INTEGER, "failed" INTEGER, "skipped" INTEGER, "start_time" TEXT, "end_time" TEXT, "elapsed" INTEGER, unique(start_time)); """
CREATE_SUITES = """ CREATE TABLE IF NOT EXISTS suites ("add_date" TEXT, "full_name" TEXT, "name" TEXT, "test_count" ITNEGER, "passed" INTEGER, "failed" INTEGER, "skipped" INTEGER, "elapsed" INTEGER, "start_time" TEXT, "end_time" TEXT); """
CREATE_TESTS = """ CREATE TABLE IF NOT EXISTS tests ("add_date" TEXT, "full_name" TEXT, "name" TEXT, "passed" INTEGER, "failed" INTEGER, "skipped" INTEGER, "elapsed" INTEGER, "start_time" TEXT, "end_time" TEXT, "tags" TEXT); """
CREATE_KEYWORDS = """ CREATE TABLE IF NOT EXISTS keywords ("add_date" TEXT, "name" TEXT, "passed" INTEGER, "failed" INTEGER, "skipped" INTEGER, "elapsed" INTEGER, "start_time" TEXT, "end_time" TEXT, "tags" TEXT); """

INSERT_INTO_STATS = """ INSERT INTO stats VALUES (?,?,?,?,?,?,?,?) """
INSERT_INTO_SUITES = """ INSERT INTO suites VALUES (?,?,?,?,?,?,?,?,?,?) """
INSERT_INTO_TESTS = """ INSERT INTO tests VALUES (?,?,?,?,?,?,?,?,?,?) """
INSERT_INTO_KEYWORDS = """ INSERT INTO keywords VALUES (?,?,?,?,?,?,?,?,?) """

DELETE_FROM_TABLE = """ DELETE FROM {table} WHERE date="{date}" """
