import { shallowMount } from '@vue/test-utils'
import ToDoList from '@/components/ToDoList/ToDoList.vue'

describe('ToDoList.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Todo List'
    const wrapper = shallowMount(ToDoList, {
      props: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
