import Link from "next/link";
import Image from "next/image";
import AvatarNav from "./AvatarNav";

const Nav = () => {
  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <p className="logo_text">Shared Diaries</p>
      </Link>

      <AvatarNav />
    </nav>
  );
};

export default Nav;
