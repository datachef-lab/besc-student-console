import Link from 'next/link';
import React from 'react'

const mastersLinks = [
    { label: "Blood Group", href: "/settings/masters/blood-group" },
    { label: "Board / universities", href: "/settings/masters/board-universities" },
    { label: "Annual Income", href: "/settings/masters/annual-incomes" },
    { label: "Categories", href: "/settings/masters/categories" },
    { label: "Courses", href: "/settings/masters/" },
    { label: "Religion", href: "/settings/masters/religions" },
    { label: "Nationalities", href: "/settings/masters/nationalities" },
];
export default function MastersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex justify-between w-full h-full'>
        <div className='w-[80%]'>
            {children}
        </div>
        <div className="flex">
            <ul>
                {mastersLinks.map((link) => (
                    <li key={link.href}>
                        <Link href={link.href}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  )
}
