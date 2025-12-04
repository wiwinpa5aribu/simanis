import { clsx } from 'clsx'
import * as React from 'react'

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: This is a reusable component that receives htmlFor from parent
      <label
        ref={ref}
        className={clsx(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      >
        {children}
      </label>
    )
  }
)
Label.displayName = 'Label'

export { Label }
