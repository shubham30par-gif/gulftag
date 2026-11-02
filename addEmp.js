import { readFile, writeFile } from "fs/promises";
const data = JSON.parse(await readFile("AI-Emp.json", "utf-8"));
// const data = JSON.parse(await readFile("dept.json", "utf-8"));
const ceoData = [
  {
    name: "Hardik Jagdishbhai Kevadiya",
    email: "hardik.kevadiya@10turtle.com",
    role: "CEO",
    departmentId: "bd52a225-1572-4c82-bbad-db48509e49a5",
  },
  {
    name: "Mahesh Bhalala",
    email: "mahesh@10turtle.com",
    role: "CEO",
    departmentId: "bd52a225-1572-4c82-bbad-db48509e49a5",
  },
];
for (const emp of data) {
  await fetch("http://localhost:3333/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3Y2ExMDY1NS03Njc2LTQ1NzQtYjdlMy1kMzRhMzAyMDI5M2MiLCJyb2xlIjoiQ0VPIiwiaWF0IjoxNzcyNTE0NzU0LCJleHAiOjE3NzMxMTk1NTQsImlzcyI6InRlbnR1cnRsZS10b2RvLWFwcCJ9.FJtSCY2ukDqFO2A-fdfJAgPDM5bzEuQd3lzr4FF5i4Y",
    },
    body: JSON.stringify(emp),
  });
}
// await fetch("http://localhost:3333/api/users", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3Y2ExMDY1NS03Njc2LTQ1NzQtYjdlMy1kMzRhMzAyMDI5M2MiLCJyb2xlIjoiQ0VPIiwiaWF0IjoxNzcyNTE0NzU0LCJleHAiOjE3NzMxMTk1NTQsImlzcyI6InRlbnR1cnRsZS10b2RvLWFwcCJ9.FJtSCY2ukDqFO2A-fdfJAgPDM5bzEuQd3lzr4FF5i4Y",
//   },
//   body: JSON.stringify({
//     name: "Nitin Hasmukhbhai Rathod",
//     email: "nitin.rathod@10turtle.com",
//     role: "EMPLOYEE",
//     departmentId: "80d263c3-12aa-41f8-9270-c058f042140b",
//     managerId: "4c212b39-d25f-4fb2-be03-29133d5b7689",
//   }),
// });
