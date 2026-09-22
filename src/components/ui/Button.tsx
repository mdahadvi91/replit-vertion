import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('button', {
  variants: {
    variant: {
      default: 'button-primary',
      outline: 'button-outline',
      ghost: 'button-ghost',
      secondary: 'button-secondary',
      destructive: 'button-danger',
      link: 'button-ghost',
    },
    size: {
      default: '',
      sm: 'button-small',
      lg: 'button-large',
      icon: 'icon-button',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', variant = 'default', size = 'default', ...props },
  ref,
) {
  return <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />;
});