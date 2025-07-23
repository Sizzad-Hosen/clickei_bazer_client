import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";
import Sidebar from "../shared/Sidebar";



export const Home=() =>{
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          {/* Carousel and Product Grid Here */}
          <h2 className="text-xl font-bold mb-4">Featured Products</h2>
          {/* Replace below with product card components */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-40 rounded-md"></div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
