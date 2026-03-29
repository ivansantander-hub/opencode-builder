import type { Component } from "solid-js"

export interface ButtonProps {
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "primary" | "secondary"
  disabled?: boolean
  class?: string
  children: string
}

export const Button: Component<ButtonProps> = (props) => {
  const baseClass = "btn"
  const variantClass = props.variant === "secondary" ? "btn-secondary" : "btn-primary"
  const disabledClass = props.disabled ? " opacity-50 cursor-not-allowed" : ""

  return (
    <button
      type={props.type || "button"}
      class={`${baseClass} ${variantClass}${disabledClass} ${props.class || ""}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}
