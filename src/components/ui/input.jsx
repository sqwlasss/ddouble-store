import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-none border border-[#E5E5E1] bg-transparent px-3 py-1 text-base text-[#1A1A1A] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#1A1A1A] placeholder:text-[#6B6B67] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
