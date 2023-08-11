import { ApplicationError } from "@/protocols";

export function cannotListEventError(): ApplicationError {
  return {
    name: "cannotListEventError",
    message: "Cannot list events!",
  };
}
