import { h } from "vue"

export default {
  name: 'Row',
  setup(props) {
    return () =>
      h("div", { class: 'render' }, "texted")
  }
}