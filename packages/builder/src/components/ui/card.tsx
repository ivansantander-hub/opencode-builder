import type { ParentComponent } from "solid-js"

interface CardProps {
  class?: string
}

export const Card: ParentComponent<CardProps> = (props) => {
  return <div class={`card ${props.class || ""}`}>{props.children}</div>
}
