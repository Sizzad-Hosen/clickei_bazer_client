export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600">
      © 2025 CLICKEIBAZZER — All rights reserved.

       {/* Top Contact Bar */}
            <div className="bg-gray-900 text-sm text-amber-600 px-4 py-2 flex justify-around items-center flex-wrap gap-2">
              <h1 className="font-medium">
                Contact:{' '}
                <a href="mailto:clickeibazer2025july@gmail.com" className="text-lime-600 hover:underline">
                  clickeibazar2025july@gmail.com
                </a>{' '}
                | Phone:{' '}
                <a href="tel:01745455353" className="text-lime-600 hover:underline">
                  01745455353
                </a>
              </h1>
              <a
                href="https://www.facebook.com/share/1Fh8DHu1UG/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lime-600 hover:underline flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M22 12a10 10 0 1 0-11.63 9.87v-7H8v-3h2.37V9.5c0-2.3 1.37-3.57 3.47-3.57.7 0 1.44.12 1.44.12v1.58H14.6c-1.14 0-1.5.71-1.5 1.44V12h2.56l-.41 3h-2.15v7A10 10 0 0 0 22 12z" />
                </svg>
                Facebook
              </a>
            </div>
            
    </footer>
  );
}
