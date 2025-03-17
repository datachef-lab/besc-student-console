import { mysqlConnection } from "@/db";
import { Nationality } from "@/types/resources/nationality";
import { RowDataPacket } from "mysql2";

export async function findNationalityById(id: number = 1) {
    const [rows] = await mysqlConnection.query<RowDataPacket[]>(`
        SELECT * 
        FROM nationality
        WHERE id = ${id}
    `);

    console.log(rows);
    return rows.length > 0 ? (rows[0] as Nationality) : null; // Return the paginated batch data in descending order
}