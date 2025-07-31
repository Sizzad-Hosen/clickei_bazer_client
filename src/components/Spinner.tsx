// components/ui/spinner.jsx
import Image from 'next/image';
import logo from '../../public/clickeiBazer-png.png';


export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <Image
        src={logo}
        alt="Loading..."
        width={50}
        height={50}
        className="animate-spin"
      />
    </div>
  );
}
