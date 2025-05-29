import { useState } from "react";

const courses = [
  { id: 1, name: "B.A. English (H) (Day)" },
  { id: 2, name: "B.A. History (H) (Day)" },
  { id: 3, name: "B.A. Journalism and Mass Comm (H) (Day)" },
  { id: 4, name: "B.A. Political Science (H) (Day)" },
  { id: 5, name: "B.A. SOCIOLOGY (H) (Day)" },
  { id: 6, name: "B.COM (H) (Morning)" },
  { id: 7, name: "B.COM (H) (Evening)" },
  { id: 8, name: "B.Sc. Economics (H) (Day)" },
  { id: 9, name: "B.Sc. Mathematics (H) (Day)" },
  { id: 10, name: "BBA (H) (Day)" },
];

const COURSE_FEE = 500;

export default function CourseApplicationStep() {
  const [selected, setSelected] = useState<{ [key: number]: boolean }>({});

  const handleCheckbox = (id: number) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  
  const price = Object.values(selected).filter(Boolean).length * COURSE_FEE;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Step 3 of 5 - Course Selection (Sr. No. 18)</h2>
      <div className="font-semibold mb-2">18. Course Selection</div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 w-10">Srl</th>
              <th className="border px-2 py-1">Course</th>
              <th className="border px-2 py-1 w-16">Select</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="text-center">
                <td className="border px-2 py-1">{course.id}</td>
                <td className="border px-2 py-1 text-left">{course.name}</td>
                <td className="border px-2 py-1">
                  <input
                    type="checkbox"
                    checked={!!selected[course.id]}
                    onChange={() => handleCheckbox(course.id)}
                    className="accent-green-600 w-4 h-4"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 my-4 text-yellow-800 text-sm rounded">
        <div className="font-semibold mb-1">Please Note :</div>
        <ol className="list-decimal ml-5">
          <li>Course / Session selected here can not be Removed once Saved.</li>
          <li>Multiple course/sessions can be added later on using the same login details sent via SMS/Email in your registered mobile no or email ID.</li>
        </ol>
      </div>
      <div className="font-bold text-lg mt-4">Total Application Fees to be paid :</div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xl font-semibold">₹</span>
        <input
          type="number"
          className="border border-gray-300 rounded px-2 py-1 w-32 text-right bg-gray-100"
          value={price}
          readOnly
        />
        <span className="ml-2">Price .00</span>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 rounded mt-4 text-lg"
      >
        Submit
      </button>
    </form>
  );
}
