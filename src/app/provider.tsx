import { Theme } from "@radix-ui/themes";

export function Provider({ children }: { children: React.ReactNode }) {
  return <Theme>{children}</Theme>;
}
