import { column, defineDb } from 'astro:db';

const Guests = {
  columns: {
    phone: column.text({ primaryKey: true }),
    fullName: column.text(),
    tickets: column.text()
  }

}

export default defineDb({
  tables: {
    Guests
  }
});
