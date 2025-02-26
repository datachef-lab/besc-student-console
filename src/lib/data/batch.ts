import { mysqlConnection } from "@/db";
import { RowDataPacket } from "mysql2";

export async function findAllBatches(page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize; // Starting point for pagination

    const [rows] = await mysqlConnection.query<RowDataPacket[]>(
        `SELECT * FROM studentpaperlinkingmain ORDER BY id DESC LIMIT ? OFFSET ?`,
        [pageSize, offset]
    );

    return rows; // Return the paginated batch data in descending order
}
