import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import toNow from 'date-fns/distance_in_words_to_now'
import VueTimeago from 'vue-timeago'
import VOperationsTimelineItem from '@/components/VOperationsTimelineItem'
import socketFixture from './fixtures/socketServer'

const localVue = createLocalVue()
localVue.use(VueTimeago)

describe('TheOperationsLog', () => {
  let props

  const build = () => {
    const options = {
      propsData: props,
      localVue,
    }

    const wrapper = shallowMount(VOperationsTimelineItem, options)
    const wrapperMounted = mount(VOperationsTimelineItem, options)

    return {
      wrapper,
      type: () => wrapper.find('.type'),
      schema: () => wrapper.find('.schema'),
      table: () => wrapper.find('.table'),
      date: () => wrapperMounted.find('.date'),
    }
  }

  beforeEach(() => {
    props = {
      operation: {}
    }
  })

  it('renders the component correctly', () => {
    // arranje
    const { wrapper } = build()

    // assert
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders operation information', () => {
    // arranje
    props.operation = socketFixture.response.INSERT
    const { type, schema, table, date } = build()

    // assert
    expect(type().exists()).toBe(true)
    expect(type().text()).toContain(props.operation.type)

    expect(schema().exists()).toBe(true)
    expect(schema().text()).toContain(props.operation.schema)

    expect(table().exists()).toBe(true)
    expect(table().text()).toContain(props.operation.table)

    expect(date().exists()).toBe(true)
    expect(date().text()).toContain(toNow(props.operation.timestamp))
  })
})