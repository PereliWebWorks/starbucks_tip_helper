'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmployeesSchema extends Schema {
  up () {
    this.create('employees', (table) => {
      table.increments()
      table.string('first_name', 60).notNullable();
      table.string('last_name', 60).notNullable();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('Users.id');
      table.timestamps()
    })
  }

  down () {
    this.drop('employees')
  }
}

module.exports = EmployeesSchema
