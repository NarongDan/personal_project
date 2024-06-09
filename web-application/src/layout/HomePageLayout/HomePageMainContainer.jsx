import { Outlet } from "react-router-dom";
import HomePageNavbar from "./HomePageNavbar";
import HomePageFooter from "./HomePageFooter";

export default function HomePageMainContainer() {
  return (
    <div className="w-screen h-[100%] flex flex-col bg-gray-100">
      <HomePageNavbar />

      <main className="bg-gray-100 flex flex-col w-full h-full ">
        <Outlet />
      </main>

      <footer className="flex flex-evenly min-h-20 bg-black text-white px-16 py-8 space-x-8">
        <HomePageFooter />
      </footer>
    </div>
  );
}
