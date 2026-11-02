import { readFile, writeFile } from "fs/promises";

const data = JSON.parse(await readFile("all_employees.json", "utf-8"));

const aiTeams = data.filter((employee) => employee.Department === "AI");

console.log(aiTeams);

console.log(new Set(data.map((emp) => emp.Department)));

await writeFile("AI-Emp.json", JSON.stringify(aiTeams, null, 2));
