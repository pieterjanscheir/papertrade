import type { Feature } from "../types";
import { TestingRunner } from "./components";

export const userTesting: Feature = {
  id: "user-testing",
  name: "User testing",
  description: "Feedback button, timed test tasks with auto-completion, and CSV/Markdown export (page: /testing).",
  enabled: true,
  Runner: TestingRunner,
};
