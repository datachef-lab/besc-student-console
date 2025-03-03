// import { mysqlConnection } from "@/db";
import { findStudentByEmail } from "@/lib/services/student";
import Image from "next/image";
import React from "react";

export default async function HomePage() {
  //   const result = await mysqlConnection.query(
  //     "SELECT * FROM studentpersonaldetails WHERE id = 1"
  //   );
  const student = await findStudentByEmail("0103123014@thebges.edu.in");

  console.log(student);
  return (
    <div>
      HomePage- {student?.name}
      <Image
        src={`https://74.207.233.48:8443/hrclIRP/studentimages/${student?.imgFile}`}
        alt={student?.name || "student-profile-image"}
        width={500}
        height={500}
      />
    </div>
  );
}
