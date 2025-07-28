import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";
import React from "react";

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-teal-400 px-4 py-3 uppercase sm:px-6">
      <Link to="/" className="text-lg font-bold tracking-widest">
        Pizza House
      </Link>

      <SearchOrder />

      <Username />
    </header>
  );
}

export default Header;
