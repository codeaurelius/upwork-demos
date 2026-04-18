import type { Metadata } from "next";
import RestaurantDashboard from "./RestaurantDashboard";

export const metadata: Metadata = {
  title: "Restaurant Campaign Dashboard",
};

export default function Page() {
  return <RestaurantDashboard />;
}
