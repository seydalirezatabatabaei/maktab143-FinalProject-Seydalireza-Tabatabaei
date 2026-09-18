
import Image from "next/image";
import logo from "../../public/logo.png";

export default function Logo() {
  return (
    <Image
      src={logo}
      alt="Logo"
      width={70}
      height={70}
    />
  );
}
