import { column, defineDb } from 'astro:db';

const Guests = {
  columns: {
    id: column.text({ primaryKey: true }),
    phone: column.text(),
    fullName: column.text(),
    tickets: column.text(),
    isScanned: column.boolean()
  }

}

export default defineDb({
  tables: {
    Guests
  }
});
