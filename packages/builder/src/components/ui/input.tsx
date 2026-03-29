import type { Component } from "solid-js"

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
}

export const Input: Component<InputProps> = (props) => {
  return (
    <input
      type={props.type || "text"}
      class="input"
      value={props.value || ""}
      placeholder={props.placeholder}
      onInput={(e) => props.onChange?.(e.currentTarget.value)}
    />
  )
}
