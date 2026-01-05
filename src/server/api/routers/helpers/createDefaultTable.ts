

export async function createDefaultTable(
  db: any,
  baseId: string,
  tableName: string
) {
  // 1. Create table
  const table = await db.table.create({
    data: {
      base_id: baseId,
      table_name: tableName,
    },
  });

  // 2. Create default fields
  await db.field.createMany({
    data: [
      {
        table_id: table.id,
        name: "Name",
        type: "text",
        options: {},
        order_index: 0,
      },
      {
        table_id: table.id,
        name: "Notes",
        type: "text",
        options: {},
        order_index: 1,
      },
    ],
  });

  const fields = await db.field.findMany({
    where: { table_id: table.id },
  });

  // 3. Create default row
  const row = await db.row.create({
    data: {
      table_id: table.id,
    },
  });

  // 4. Create default cells
  await db.cell.createMany({
    data: fields.map((f) => ({
      field_id: f.id,
      row_id: row.id,
      value: "",
    })),
  });

  return table;
}
