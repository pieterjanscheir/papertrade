import { GraduationCap } from "lucide-react";
import type { Feature } from "../types";

export const learn: Feature = {
  id: "learn",
  name: "Learn",
  description: "Lessons on basics, orders and options, each with a joke “video” and real notes.",
  enabled: true,
  nav: { href: "/learn", label: "Learn", icon: GraduationCap },
};
