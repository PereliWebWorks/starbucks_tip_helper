'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.dropColumn('email');
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.string('email', 254).notNullable().unique();
    })
  }
}

module.exports = UsersSchema
