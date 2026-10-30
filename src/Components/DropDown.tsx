'use client';
import Link from 'next/link';

const DropdownMenu = () => {
  return (
    <div className="relative group inline-block text-left">
      {/* Button */}
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Dropdown Hover
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <div className="absolute hidden group-hover:block z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
          <li>
            <Link
              href="/Assistant"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Assistant
            </Link>
          </li>

          <li>
            <Link
              href="/Bookseat"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Bookseat
            </Link>
          </li>
          
          <li>
            <Link
              href="/Clipboard"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Clipboard
            </Link>
          </li>
          
          <li>
            <Link
              href="/Uncrop"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Uncrop
            </Link>
          </li>
        
          
          {/* <li>
            <Link
              href="/Expense"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Expense
            </Link>
          </li> */}
        
        </ul>
      </div>
    </div>
  );
};

export default DropdownMenu;
