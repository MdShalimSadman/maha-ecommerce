import { ShoppingCart, Star } from "lucide-react"
import { Input } from "../ui/input"
import Link from "next/link"

const Navbar = () => {
  return (
    <div className="flex w-full items-center  bg-[#FDF7F2] justify-between p-4 px-6">
      <Input
       placeholder="SEARCH"
       className=" w-40 placeholder:text-sm !placeholder:text-[#5e5a57] text-black border-none border-b border-b-[#5e5a57]"
      />
      <Link href={"/"}>
      <p className="text-pink-900 text-3xl font-semibold">MAHA LOGO</p>
      </Link>
      <div className="flex gap-4">
        <Star className="text-[#5e5a57] hover:text-pink-900 cursor-pointer" />
        <ShoppingCart className="text-[#5e5a57] hover:text-pink-900 cursor-pointer"/>
      </div>
    </div>
  )
}

export default Navbar
