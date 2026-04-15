'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Borrowings', [
      {
        member_id: 1,
        book_id: 1,
        borrow_date: new Date('2026-04-10'),
        return_date: null,
        due_date: new Date('2026-04-17'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        member_id: 2,
        book_id: 2,
        borrow_date: new Date('2026-04-08'),
        return_date: new Date('2026-04-11'),
        due_date: new Date('2026-04-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Borrowings', null, {});
  }
};
