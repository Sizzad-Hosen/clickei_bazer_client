export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
    

      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* ABOUT US */}
        <div>
          <h2 className="text-white font-semibold mb-3">About Us</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            CLICKEIBAZZER is your trusted online marketplace for groceries, 
            fresh foods, electronics, and more. We ensure quality products 
            and fast delivery at your doorstep.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h2 className="text-white font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-amber-500">About Us</a></li>
            <li><a href="#" className="hover:text-amber-500">Refund Policy</a></li>
            <li><a href="#" className="hover:text-amber-500">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h2 className="text-white font-semibold mb-3">Contact Info</h2>
          <ul className="space-y-2">
            <li>Email: 
              <a href="mailto:clickeibazer2025july@gmail.com" className="ml-1 text-lime-500 hover:underline">
                clickeibazar2025july@gmail.com
              </a>
            </li>
            <li>Phone: 
              <a href="tel:01745455353" className="ml-1 text-lime-500 hover:underline">
                01745455353
              </a>
            </li>
            <li>WhatsApp: 
              <a href="https://wa.me/8801745455353" target="_blank" rel="noopener noreferrer" className="ml-1 text-lime-500 hover:underline">
                Chat Now
              </a>
            </li>
            <li>Address: Rangpur, Bangladesh</li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div>
          <h2 className="text-white font-semibold mb-3">Follow Us</h2>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/share/1Fh8DHu1UG/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-amber-500"
            >
              Facebook
            </a>
            <a
              href="mailto:clickeibazer2025july@gmail.com"
              className="text-gray-400 hover:text-amber-500"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-gray-800 text-center py-4 text-gray-400 text-xs">
        © 2025 CLICKEIBAZZER — All rights reserved.
      </div>
    </footer>
  );
}
