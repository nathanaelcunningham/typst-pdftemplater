MIGRATION_DIR=internal/db/migrations
DB_PATH=sqlite://tmp/db

gen/sql:
	sqlc generate

migrations/up:
	go run -tags 'sqlite' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path=${MIGRATION_DIR} -database ${DB_PATH} up

migrations/down:
	go run -tags 'sqlite' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path=${MIGRATION_DIR} -database ${DB_PATH} down -all

migrations/goto:
	go run -tags 'sqlite' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path=${MIGRATION_DIR} -database ${DB_PATH} goto ${version}

migrations/new:
	go run -tags 'sqlite' github.com/golang-migrate/migrate/v4/cmd/migrate@latest create  -dir=${MIGRATION_DIR} -ext=.sql ${name}
