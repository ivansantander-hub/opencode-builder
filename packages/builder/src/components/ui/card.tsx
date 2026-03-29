import type { Component, ParentComponent } from "solid-js"

export const Card: ParentComponent = (props) => {
  return <div class="card">{props.children}</div>
}
