// import { mysqlConnection } from "@/db";
import { findStudentByEmail } from "@/lib/data/student";
import React from "react";

export default async function HomePage() {
  //   const result = await mysqlConnection.query(
  //     "SELECT * FROM studentpersonaldetails WHERE id = 1"
  //   );
  const student = await findStudentByEmail("0103123014@thebges.edu.in");
  console.log(student);
  return <div>HomePage- {student?.name}</div>;
}
