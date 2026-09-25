import { cn } from "@/lib/utils";

const ACCORDION_LOADER_BLOCKS = ["█", "▓", "▒"] as const;

type AccordionLoaderProps = React.ComponentProps<"span"> & {
  blocks?: readonly string[];
  track?: string;
  trackLength?: number;
};

function AccordionLoader(){

  return(
    <span className="loading loading-spinner loading-xl"></span>
  )
}


export { AccordionLoader };
