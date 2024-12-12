#!/bin/bash

# Determine the operating system
case "$(uname -s)" in
Darwin | Linux | *BSD)
  IS_UNIX=true
  ;;
CYGWIN* | MINGW* | MSYS* | Windows_NT)
  IS_UNIX=false
  ;;
*)
  echo "Unsupported operating system"
  exit 1
  ;;
esac

# Function to generate timestamp
generate_timestamp() {
  if [ "$IS_UNIX" = true ]; then
    date +"%Y%m%d%H%M%S"
  else
    powershell -Command "Get-Date -Format 'yyyyMMddHHmmss'"
  fi
}

# Function to convert string to snake case
to_snake_case() {
  echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1_\2/g' | tr '[:upper:]' '[:lower:]' | tr ' ' '_'
}

# Get migration name from command line argument
if [ $# -eq 0 ]; then
  echo "Usage: $0 <migration_name>"
  exit 1
fi

# Generate timestamp and format migration name
timestamp=$(generate_timestamp)
migration_name=$(to_snake_case "$1")
file_name="${timestamp}_${migration_name}.ts"

migrations_dir="src/db/migrations"

# Create migrations directory if it doesn't exist
if [ ! -d "$migrations_dir" ]; then
  if [ "$IS_UNIX" = true ]; then
    mkdir -p "$migrations_dir"
  else
    powershell -Command "New-Item -ItemType Directory -Force -Path '$migrations_dir'"
  fi
fi

# Create migration file with template
template="// Migration: $migration_name
// Created at: $(date)

import { Kysely } from 'kysely';
import { Database } from '../schema';

export async function up(db: Kysely<Database>): Promise<void> {
  // Write your UP migration here
}

export async function down(db: Kysely<Database>): Promise<void> {
  // Write your DOWN migration here
}
"

if [ "$IS_UNIX" = true ]; then
  echo "$template" >"$migrations_dir/$file_name"
else
  echo "$template" | Out-File -Encoding UTF8 "$migrations_dir/$file_name"
fi

echo "Created migration file: $migrations_dir/$file_name"
